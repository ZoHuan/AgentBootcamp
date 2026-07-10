export interface PlanStep {
  id: string;
  description: string;
  tool?: string;
  status: string;
}

export interface Plan {
  id: string;
  goal: string;
  steps: PlanStep[];
}
