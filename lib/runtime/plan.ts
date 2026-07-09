import { Plan, PlanStep } from "./types";

export function nextStep(plan: Plan): PlanStep | null {
  return plan.steps.find((s) => s.status === "pending") ?? null;
}
