export interface PlanStep {
  description: string;
  status: "pending" | "running" | "done";
}

export interface Plan {
  goal: string;
  steps: PlanStep[];
}

export class Planner {
  createPlan(userInput: string): Plan {
    const steps: PlanStep[] = [
      { description: "分析用户输入", status: "pending" },
    ];

    if (userInput.includes("天气")) {
      steps.push({ description: "调用 get_weather 工具", status: "pending" });
    }

    steps.push({ description: "生成最终回答", status: "pending" });

    const plan: Plan = {
      goal: `回答问题: ${userInput.slice(0, 30)}...`,
      steps,
    };

    console.log("======== PLAN ========");
    console.log(`Goal: ${plan.goal}`);
    plan.steps.forEach((s, i) => {
      console.log(`Step${i + 1}: ${s.description} [${s.status}]`);
    });
    console.log("======================");

    return plan;
  }
}
