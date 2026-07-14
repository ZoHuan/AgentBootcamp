export type ApprovalStatus = "pending" | "approved" | "rejected";

export enum RiskLevel {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export interface ApprovalRequest {
  id: string;
  action: string;
  reason: string;
  status: ApprovalStatus;
  riskLevel: RiskLevel;
  createdAt: Date;
  resolvedAt?: Date;
}
