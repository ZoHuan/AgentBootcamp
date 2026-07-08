export type WorkflowStatus = "running" | "completed" | "failed";

export interface WorkflowState {
  currentStep: string;
  status: WorkflowStatus;
  data: Record<string, unknown>;
}
