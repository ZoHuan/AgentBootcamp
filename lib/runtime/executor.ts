import OpenAI from "openai";
import { ToolRegistry } from "@/lib/tools/registry";
import { KeywordRouter } from "@/lib/tools/router";
import { Tool } from "@/lib/tools/tool";
import { ToolGuardrail } from "@/lib/guardrails/tool-guard";
import { RiskLevel } from "@/lib/approval/approval";

const client = new OpenAI({
  apiKey: process.env.MIMO_API_KEY,
  baseURL: "https://token-plan-cn.xiaomimimo.com/v1",
});

export class Executor {
  private registry: ToolRegistry;
  private router: KeywordRouter;
  private toolGuard: ToolGuardrail;

  constructor(registry: ToolRegistry) {
    this.registry = registry;
    this.router = new KeywordRouter(registry);
    this.toolGuard = new ToolGuardrail();
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
      const candidates = this.router.route(userInput);
      if (candidates.length > 0) {
        return candidates.map((c) => this.toOpenAITool(c.tool));
      }
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

        const guardCheck = await this.toolGuard.check({
          name: tc.function.name,
          riskLevel: RiskLevel.LOW,
        });
        if (!guardCheck.passed) {
          conversation.push({
            role: "tool",
            tool_call_id: tc.id,
            content: JSON.stringify({ error: guardCheck.reason }),
          });
          continue;
        }

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
