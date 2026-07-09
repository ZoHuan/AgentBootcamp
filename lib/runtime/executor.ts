import OpenAI from "openai";
import { getToolDefinitions, executeTool } from "@/lib/tools/runner";

const client = new OpenAI({
  apiKey: process.env.MIMO_API_KEY,
  baseURL: "https://token-plan-cn.xiaomimimo.com/v1",
});

export class Executor {
  async askLLM(
    conversation: OpenAI.Chat.Completions.ChatCompletionMessageParam[]
  ) {
    const response = await client.chat.completions.create({
      model: "mimo-v2.5",
      messages: conversation,
      tools: getToolDefinitions(),
    });

    const choice = response.choices[0];
    const toolCalls = choice.message.tool_calls ?? null;

    conversation.push(choice.message);

    if (toolCalls) {
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

    return toolCalls;
  }

  respond(
    conversation: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
    onComplete: (fullContent: string) => void
  ) {
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

        onComplete(fullContent);
        controller.close();
      },
    });
  }
}
