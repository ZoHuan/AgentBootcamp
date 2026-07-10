import OpenAI from "openai";
import { Plan } from "./plan";
import { validate } from "./validator";

const client = new OpenAI({
  apiKey: process.env.MIMO_API_KEY,
  baseURL: "https://token-plan-cn.xiaomimimo.com/v1",
});

const PLANNING_PROMPT = `You are a planning assistant. Given a user goal, generate a structured plan.

Return ONLY valid JSON in this format:
{
  "goal": "用户目标",
  "steps": [
    { "id": "step1", "description": "步骤描述", "status": "pending" }
  ]
}

Rules:
- steps must contain at least 1 step
- each step must have id, description, and status
- Return ONLY the JSON object. No markdown, no explanation.`;

export class LLMPlanner {
  async createPlan(goal: string): Promise<Plan> {
    let lastError = "";

    for (let attempt = 0; attempt < 3; attempt++) {
      const response = await client.chat.completions.create({
        model: "mimo-v2.5",
        messages: [
          { role: "system", content: PLANNING_PROMPT },
          { role: "user", content: goal },
        ],
      });

      const text = response.choices[0]?.message?.content || "";
      const cleaned = text.replace(/```(?:json)?\s*/gi, "").replace(/\s*```/g, "").trim();

      try {
        const parsed = JSON.parse(cleaned);
        if (validate(parsed)) return parsed;
        lastError = "校验失败";
      } catch (err) {
        lastError = err instanceof Error ? err.message : "解析失败";
      }

      console.warn(`[LLMPlanner] 第 ${attempt + 1} 次尝试失败: ${lastError}`);
    }

    throw new Error(`LLMPlanner 失败（3次重试后）: ${lastError}`);
  }
}
