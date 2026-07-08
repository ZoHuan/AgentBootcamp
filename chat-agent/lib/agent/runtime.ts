import OpenAI from "openai";
import { MemoryManager } from "@/lib/memory/memory";
import { Planner } from "./planner";
import { Executor } from "./executor";
import { Reflector } from "./reflector";

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
    this.executor = new Executor();
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

    this.planner.createPlan((lastUserMsg?.content as string) || "");

    let retries = 0;
    const maxRetries = 2;

    while (true) {
      await this.executor.askLLM(conversation);

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

      console.log("======== REFLECTION ========");
      console.log(`Success: ${evaluation.success}`);
      console.log(`Confidence: ${evaluation.confidence}`);
      console.log(`Reason: ${evaluation.reason}`);
      console.log(`Retry: ${evaluation.retry}`);
      console.log(`Retries: ${retries}/${maxRetries}`);
      console.log("============================");

      if (!evaluation.retry || retries >= maxRetries) {
        this.memory.save("assistant", fullText);

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

      retries++;
    }
  }
}
