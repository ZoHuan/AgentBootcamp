import OpenAI from "openai";
import { MemoryManager } from "@/lib/memory/memory";
import { Planner } from "./planner";
import { Executor } from "./executor";

export class AgentRuntime {
  private systemPrompt: string;
  private memory: MemoryManager;
  private planner: Planner;
  private executor: Executor;

  constructor(systemPrompt: string) {
    this.systemPrompt = systemPrompt;
    this.memory = new MemoryManager(10);
    this.planner = new Planner();
    this.executor = new Executor();
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

    await this.executor.askLLM(conversation);

    return this.executor.respond(conversation, (fullContent) => {
      this.memory.save("assistant", fullContent);
    });
  }
}
