import { Plan, PlanStep } from "./types";

export class Planner {
  createPlan(userInput: string): Plan {
    const steps: PlanStep[] = [
      {
        id: crypto.randomUUID(),
        title: "分析意图",
        description: "理解用户输入内容",
        status: "pending",
      },
    ];

    if (userInput.includes("天气")) {
      steps.push({
        id: crypto.randomUUID(),
        title: "查询天气",
        description: "调用 get_weather 获取天气数据",
        tool: "get_weather",
        status: "pending",
      });
    }

    steps.push({
      id: crypto.randomUUID(),
      title: "生成回答",
      description: "根据结果生成最终回复",
      status: "pending",
    });

    return {
      id: crypto.randomUUID(),
      goal: `回答问题: ${userInput.slice(0, 30)}...`,
      steps,
    };
  }
}
