import OpenAI from "openai";
import { getToolDefinitions, executeTool } from "@/lib/tools/runner";

const client = new OpenAI({
  apiKey: process.env.MIMO_API_KEY,
  baseURL: "https://token-plan-cn.xiaomimimo.com/v1",
});

export class AgentRuntime {
  private systemPrompt: string;

  constructor(systemPrompt: string) {
    this.systemPrompt = systemPrompt;
  }

  async run(userMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[]) {
    const conversation: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: "system", content: this.systemPrompt },
      ...userMessages,
    ];

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
    return new ReadableStream({
      async start(controller) {
        const response = await client.chat.completions.create({
          model: "mimo-v2.5",
          messages: conversation,
          stream: true,
        });

        for await (const chunk of response) {
          const content = chunk.choices[0]?.delta?.content || "";
          controller.enqueue(new TextEncoder().encode(content));
        }
        controller.close();
      },
    });
  }
}
