import OpenAI from "openai";
import { ToolRegistry } from "@/lib/tools/registry";
import { ToolSelector } from "@/lib/tools/selector";
import { Tool } from "@/lib/tools/tool";

const client = new OpenAI({
  apiKey: process.env.MIMO_API_KEY,
  baseURL: "https://token-plan-cn.xiaomimimo.com/v1",
});

export class Executor {
  private registry: ToolRegistry;
  private selector: ToolSelector;

  constructor(registry: ToolRegistry) {
    this.registry = registry;
    this.selector = new ToolSelector(registry);
  }

  private toOpenAITool(t: Tool) {
    return {
      type: "function" as const,
      function: {
        name: t.name,
        description: t.description,
        parameters: { type: "object" as const, properties: {} },
      },
    };
  }

  private buildToolList(userInput?: string) {
    if (userInput) {
      const selected = this.selector.select(userInput);
      if (selected) return [this.toOpenAITool(selected)];
    }

    return this.registry.getAll().map((t) => this.toOpenAITool(t));
  }

  async askLLM(
    conversation: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
    userInput?: string
  ) {
    const tools = this.buildToolList(userInput);

    const response = await client.chat.completions.create({
      model: "mimo-v2.5",
      messages: conversation,
      tools,
    });

    const choice = response.choices[0];
    const toolCalls = choice.message.tool_calls ?? null;

    conversation.push(choice.message);

    if (toolCalls) {
      for (const tc of toolCalls) {
        if (tc.type !== "function") continue;

        const tool = this.registry.get(tc.function.name);
        if (!tool) continue;

        const args = JSON.parse(tc.function.arguments);
        const result = await tool.execute(args);

        conversation.push({
          role: "tool",
          tool_call_id: tc.id,
          content: typeof result === "string" ? result : JSON.stringify(result),
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
