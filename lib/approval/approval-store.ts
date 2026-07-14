import { ApprovalRequest, ApprovalStatus } from "./approval";

export class ApprovalStore {
  private requests = new Map<string, ApprovalRequest>();

  save(req: ApprovalRequest): void {
    this.requests.set(req.id, req);
  }

  get(id: string): ApprovalRequest | undefined {
    return this.requests.get(id);
  }

  updateStatus(id: string, status: ApprovalStatus): void {
    const req = this.requests.get(id);
    if (!req) return;
    req.status = status;
    req.resolvedAt = new Date();
  }
}
