export type WorkflowStatus = "running" | "completed" | "failed" | "awaiting_approval";

export interface WorkflowState {
  currentStep: string;
  status: WorkflowStatus;
  data: Record<string, unknown>;
}
