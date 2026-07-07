import { CURRENT_ROLE, ROLE_PROMPT, TASK_PROMPT, TOOL_PROMPT, buildPrompt } from "@/lib/prompts";
import { AgentRuntime } from "@/lib/agent/runtime";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const systemPrompt = buildPrompt({
    role: CURRENT_ROLE,
    task: [ROLE_PROMPT, TASK_PROMPT, TOOL_PROMPT].join("\n"),
  });

  const agent = new AgentRuntime(systemPrompt);
  const stream = await agent.run(messages);

  return new Response(stream);
}
