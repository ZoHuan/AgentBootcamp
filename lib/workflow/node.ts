import { WorkflowState } from "./state";

export interface WorkflowNode {
  id: string;
  name: string;
  execute: (state: WorkflowState) => Promise<Record<string, unknown>>;
  next?: (state: WorkflowState) => string | null;
}
