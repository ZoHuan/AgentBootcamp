export type StepStatus = "pending" | "running" | "completed" | "failed";

export interface PlanStep {
  id: string;
  title: string;
  description: string;
  tool?: string;
  status: StepStatus;
}

export interface Plan {
  id: string;
  goal: string;
  steps: PlanStep[];
}

export interface Evaluation {
  success: boolean;
  confidence: number;
  reason: string;
  retry: boolean;
}
