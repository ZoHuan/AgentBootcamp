import OpenAI from "openai";
import { MemoryManager } from "@/lib/memory/memory";
import { Planner } from "./planner";
import { Executor } from "./executor";
import { Reflector } from "./reflector";
import { nextStep } from "./plan";
import { PlanStep } from "./types";

import { createToolRegistry } from "@/lib/tools";

export class AgentRuntime {
  private systemPrompt: string;
  private memory: MemoryManager;
  private planner: Planner;
  private executor: Executor;
  private reflector: Reflector;

  constructor(systemPrompt: string) {
    this.systemPrompt = systemPrompt;
    this.memory = new MemoryManager(10);
    this.planner = new Planner();
    this.executor = new Executor(createToolRegistry());
    this.reflector = new Reflector();
  }

  async run(userMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[]) {
    const history = this.memory.formatHistory();
    const promptWithHistory = history
      ? `${this.systemPrompt}\n\n对话历史:\n${history}`
      : this.systemPrompt;

    const conversation: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: "system", content: promptWithHistory },
      ...userMessages,
    ];

    const lastUserMsg = userMessages[userMessages.length - 1];
    if (lastUserMsg?.content) {
      this.memory.save("user", lastUserMsg.content as string);
    }

    const plan = this.planner.createPlan(
      (lastUserMsg?.content as string) || ""
    );

    console.log("========== PLAN ==========");
    console.log(`Goal: ${plan.goal}`);
    plan.steps.forEach((s: PlanStep, i: number) => {
      const marker = s.status === "running"   ? "→" :
                     s.status === "completed" ? "✓" :
                     s.status === "failed"    ? "✗" : " ";
      console.log(`[${marker}] ${s.title}: ${s.description}`);
    });
    console.log("===========================");

    let step = nextStep(plan);

    while (step) {
      step.status = "running";

      let retries = 0;
      const maxRetries = 2;

      while (true) {
        await this.executor.askLLM(
          conversation,
          (lastUserMsg?.content as string) || ""
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

        if (!evaluation.retry || retries >= maxRetries) {
          step.status = evaluation.success ? "completed" : "failed";
          console.log(
            `[${step.status === "completed" ? "✓" : "✗"}] ${step.title} — ${evaluation.reason}`
          );
          this.memory.save("assistant", fullText);

          step = nextStep(plan);

          if (!step) {
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
