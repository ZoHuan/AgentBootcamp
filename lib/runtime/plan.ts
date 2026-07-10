import { Plan, PlanStep } from "@/lib/planning/plan";

export function nextStep(plan: Plan): PlanStep | null {
  return plan.steps.find((s) => s.status === "pending") ?? null;
}
