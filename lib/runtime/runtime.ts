import OpenAI from "openai";
import { MemoryManager } from "@/lib/memory/memory";
import { LLMPlanner } from "@/lib/planning/planner";
import { Executor } from "./executor";
import { Reflector } from "./reflector";
import { nextStep, Plan, PlanStep } from "@/lib/core/types/workflow";

import { createToolRegistry } from "@/lib/tools";
import { Tracer } from "@/lib/observability/tracer";
import { InputGuardrail } from "@/lib/guardrails/input-guard";
import { OutputGuardrail } from "@/lib/guardrails/output-guard";

export class AgentRuntime {
  private systemPrompt: string;
  private memory: MemoryManager;
  private planner: LLMPlanner;
  private executor: Executor;
  private reflector: Reflector;
  private tracer: Tracer;
  private inputGuard: InputGuardrail;
  private outputGuard: OutputGuardrail;

  constructor(systemPrompt: string) {
    this.systemPrompt = systemPrompt;
    this.memory = new MemoryManager(10);
    this.planner = new LLMPlanner();
    this.executor = new Executor(createToolRegistry());
    this.reflector = new Reflector();
    this.tracer = new Tracer();
    this.inputGuard = new InputGuardrail();
    this.outputGuard = new OutputGuardrail();
  }

  async run(
    userMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
  ) {
    const history = this.memory.formatHistory();
    const promptWithHistory = history
      ? `${this.systemPrompt}\n\n对话历史:\n${history}`
      : this.systemPrompt;

    const conversation: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: "system", content: promptWithHistory },
      ...userMessages,
    ];

    const lastUserMsg = userMessages[userMessages.length - 1];
    const userInput = (lastUserMsg?.content as string) || "";

    // ① Guard: 输入检查
    const inputCheck = await this.inputGuard.check(userInput);
    if (!inputCheck.passed) {
      return new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode(inputCheck.reason ?? "输入被拒绝"));
          controller.close();
        },
      });
    }

    if (lastUserMsg?.content) {
      this.memory.save("user", lastUserMsg.content as string);
    }

    // ② Trace: 开始追踪
    this.tracer.startTrace("agent-run");

    // ③ Plan: LLM 生成执行计划

    const plannerSpan = this.tracer.startSpan("planner");
    const plan = await this.planner.createPlan(userInput);
    this.tracer.endSpan(plannerSpan, true);

    console.log("========== PLAN ==========");
    console.log(`Goal: ${plan.goal}`);
    plan.steps.forEach((s: PlanStep, i: number) => {
      const marker =
        s.status === "running"
          ? "→"
          : s.status === "completed"
            ? "✓"
            : s.status === "failed"
              ? "✗"
              : " ";
      console.log(`[${marker}] ${s.description}`);
    });
    console.log("===========================");

    let step = nextStep(plan);

    while (step) {
      step.status = "running";

      let retries = 0;
      const maxRetries = 2;

      while (true) {
        const execSpan = this.tracer.startSpan("executor");
        await this.executor.askLLM(
          conversation,
          (lastUserMsg?.content as string) || "",
        );

        let fullText = "";

        const stream = this.executor.respond(conversation, (text) => {
          fullText = text;
        });

        const reader = stream.getReader();
        const decoder = new TextDecoder();
        const chunks: string[] = [];

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(decoder.decode(value, { stream: true }));
        }

        const evaluation = this.reflector.evaluate(fullText);
        this.tracer.endSpan(execSpan, evaluation.success);

        if (!evaluation.retry || retries >= maxRetries) {
          step.status = evaluation.success ? "completed" : "failed";
          console.log(
            `[${step.status === "completed" ? "✓" : "✗"}] ${step.description} — ${evaluation.reason}`,
          );
          this.memory.save("assistant", fullText);

          step = nextStep(plan);

          if (!step) {
            const outputCheck = await this.outputGuard.check(fullText);
            if (!outputCheck.passed) {
              return new ReadableStream({
                start(controller) {
                  controller.enqueue(new TextEncoder().encode(outputCheck.reason ?? "输出被拒绝"));
                  controller.close();
                },
              });
            }

            const answerSpan = this.tracer.startSpan("answer");
            this.tracer.endSpan(answerSpan, true);
            this.tracer.endTrace();

            return new ReadableStream({
              start(controller) {
                const encoder = new TextEncoder();
                for (const chunk of chunks) {
                  controller.enqueue(encoder.encode(chunk));
                }
                controller.close();
              },
            });
          }
          break;
        }

        retries++;
      }
    }

    return new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(""));
        controller.close();
      },
    });
  }
}
