import { ApprovalRequest, RiskLevel } from "./approval";
import { ApprovalStore } from "./approval-store";

export class ApprovalManager {
  private store = new ApprovalStore();

  requestApproval(action: string, reason: string, risk: RiskLevel): ApprovalRequest {
    const req: ApprovalRequest = {
      id: crypto.randomUUID(),
      action,
      reason,
      status: "pending",
      riskLevel: risk,
      createdAt: new Date(),
    };
    this.store.save(req);
    return req;
  }

  approve(id: string): void {
    this.store.updateStatus(id, "approved");
  }

  reject(id: string): void {
    this.store.updateStatus(id, "rejected");
  }

  getStatus(id: string) {
    return this.store.get(id)?.status ?? "pending";
  }

  needsApproval(risk: RiskLevel): boolean {
    return risk !== RiskLevel.LOW;
  }
}
