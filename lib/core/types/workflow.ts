export interface PlanStep { id: string; description: string; tool?: string; status: string; }
export interface Plan { id: string; goal: string; steps: PlanStep[]; }
export function nextStep(plan: Plan): PlanStep | null { return plan.steps.find((s) => s.status === "pending") ?? null; }
export type WorkflowStatus = "running" | "completed" | "failed" | "awaiting_approval";
export interface WorkflowState { currentStep: string; status: WorkflowStatus; data: Record<string, unknown>; }
