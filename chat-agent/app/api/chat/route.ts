import OpenAI from "openai";
import { CURRENT_ROLE, ROLE_PROMPT, TASK_PROMPT, STRUCTURED_OUTPUT_PROMPT, buildPrompt } from "@/lib/prompts";
import { parseResponse } from "@/lib/parser/parseResponse";

const client = new OpenAI({
  apiKey: process.env.MIMO_API_KEY,
  baseURL: "https://token-plan-cn.xiaomimimo.com/v1",
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  const systemPrompt = buildPrompt({
    role: CURRENT_ROLE,
    task: [ROLE_PROMPT, TASK_PROMPT, STRUCTURED_OUTPUT_PROMPT].join("\n"),
  });

  const formattedMessages = [
    { role: "system" as const, content: systemPrompt },
    ...messages,
  ];

  const response = await client.chat.completions.create({
    model: "mimo-v2.5",
    messages: formattedMessages,
    stream: true,
  });

  const stream = new ReadableStream({
    async start(controller) {
      let fullText = "";

      for await (const chunk of response) {
        const content = chunk.choices[0]?.delta?.content || "";
        fullText += content;
        controller.enqueue(new TextEncoder().encode(content));
      }

      const parsed = parseResponse(fullText);
      console.log("[chat] 解析结果:", parsed);

      controller.close();
    },
  });

  return new Response(stream);
}
