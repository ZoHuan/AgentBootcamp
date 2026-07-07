import OpenAI from "openai";
import { getToolDefinitions, executeTool } from "@/lib/tools/runner";
import { MemoryManager } from "@/lib/memory/memory";

const client = new OpenAI({
  apiKey: process.env.MIMO_API_KEY,
  baseURL: "https://token-plan-cn.xiaomimimo.com/v1",
});

export class AgentRuntime {
  private systemPrompt: string;
  private memory: MemoryManager;

  constructor(systemPrompt: string) {
    this.systemPrompt = systemPrompt;
    this.memory = new MemoryManager(10);
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

    const toolCalls = await this.plan(conversation);

    if (toolCalls) {
      this.execute(conversation, toolCalls);
    }

    return this.respond(conversation);
  }

  private async plan(
    conversation: OpenAI.Chat.Completions.ChatCompletionMessageParam[]
  ) {
    const response = await client.chat.completions.create({
      model: "mimo-v2.5",
      messages: conversation,
      tools: getToolDefinitions(),
    });

    const choice = response.choices[0];
    conversation.push(choice.message);
    return choice.message.tool_calls ?? null;
  }

  private execute(
    conversation: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
    toolCalls: OpenAI.Chat.Completions.ChatCompletionMessageToolCall[]
  ) {
    for (const tc of toolCalls) {
      if (tc.type !== "function") continue;

      const args = JSON.parse(tc.function.arguments);
      const result = executeTool(tc.function.name, args);
      if (!result) continue;

      conversation.push({
        role: "tool",
        tool_call_id: tc.id,
        content: result,
      });
    }
  }

  private respond(
    conversation: OpenAI.Chat.Completions.ChatCompletionMessageParam[]
  ) {
    const memory = this.memory;

    return new ReadableStream({
      async start(controller) {
        const response = await client.chat.completions.create({
          model: "mimo-v2.5",
          messages: conversation,
          stream: true,
        });

        let fullContent = "";

        for await (const chunk of response) {
          const content = chunk.choices[0]?.delta?.content || "";
          fullContent += content;
          controller.enqueue(new TextEncoder().encode(content));
        }

        memory.save("assistant", fullContent);

        controller.close();
      },
    });
  }
}
