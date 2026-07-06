import OpenAI from "openai";
import { CURRENT_ROLE, ROLE_PROMPT, TASK_PROMPT, TOOL_PROMPT, buildPrompt } from "@/lib/prompts";
import { WEATHER_TOOL, executeTool } from "@/lib/tools/getWeather";

const client = new OpenAI({
  apiKey: process.env.MIMO_API_KEY,
  baseURL: "https://token-plan-cn.xiaomimimo.com/v1",
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  const systemPrompt = buildPrompt({
    role: CURRENT_ROLE,
    task: [ROLE_PROMPT, TASK_PROMPT, TOOL_PROMPT].join("\n"),
  });

  const conversation: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
    ...messages,
  ];

  // 第一轮：让 LLM 决定是否调工具（非流式）
  const firstResponse = await client.chat.completions.create({
    model: "mimo-v2.5",
    messages: conversation,
    tools: [WEATHER_TOOL],
  });

  const choice = firstResponse.choices[0];

  // 如果 LLM 要求调工具
  if (choice.message.tool_calls?.length) {
    conversation.push(choice.message);

    for (const tc of choice.message.tool_calls) {
      if (tc.type !== "function") continue;
      const args = JSON.parse(tc.function.arguments);
      const result = executeTool(tc.function.name, args);

      conversation.push({
        role: "tool",
        tool_call_id: tc.id,
        content: result,
      });
    }

    console.log("[chat] 工具已调用, 结果已返回 LLM");
  }

  // 第二轮：流式返回最终答案
  const stream = new ReadableStream({
    async start(controller) {
      const finalResponse = await client.chat.completions.create({
        model: "mimo-v2.5",
        messages: conversation,
        stream: true,
      });

      for await (const chunk of finalResponse) {
        const content = chunk.choices[0]?.delta?.content || "";
        controller.enqueue(new TextEncoder().encode(content));
      }
      controller.close();
    },
  });

  return new Response(stream);
}

