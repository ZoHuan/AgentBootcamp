import { WorkflowState } from "./state";
import { RiskLevel } from "@/lib/approval/approval";

export interface WorkflowNode {
  id: string;
  name: string;
  execute: (state: WorkflowState) => Promise<Record<string, unknown>>;
  next?: (state: WorkflowState) => string | null;
  needsApproval?: boolean;
  riskLevel?: RiskLevel;
}
