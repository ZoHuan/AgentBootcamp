import { WorkflowState } from "./state";
import { WorkflowNode } from "./node";
import { StateMachine } from "@/lib/state/machine";
import { CheckpointManager } from "@/lib/state/checkpoint";
import { ApprovalManager } from "@/lib/approval/approval-manager";
import { RiskLevel } from "@/lib/approval/approval";

export class WorkflowEngine {
  private nodeMap: Map<string, WorkflowNode>;
  private state: WorkflowState;
  private sm: StateMachine;
  private checkpoint: CheckpointManager;
  private approval: ApprovalManager;

  constructor(nodes: WorkflowNode[]) {
    this.nodeMap = new Map(nodes.map((n) => [n.id, n]));
    this.state = { currentStep: "", status: "running", data: {} };
    this.sm = new StateMachine();
    this.checkpoint = new CheckpointManager();
    this.approval = new ApprovalManager();
  }

  async start(): Promise<WorkflowState> {
    this.sm.transition("START");

    const resumeCp = this.checkpoint.load();
    const firstNode = resumeCp
      ? (this.nodeMap.get(resumeCp.node) ?? Array.from(this.nodeMap.values())[0])
      : Array.from(this.nodeMap.values())[0];

    if (!firstNode) {
      this.state.status = "completed";
      return this.state;
    }

    if (resumeCp) {
      this.state.data = resumeCp.data;
      console.log(`[Resume] 从检查点恢复: ${resumeCp.id}, 继续执行 ${resumeCp.node}`);
    }

    let currentNode: WorkflowNode | null = firstNode;

    while (currentNode) {
      if (currentNode.needsApproval && this.approval.needsApproval(currentNode.riskLevel ?? RiskLevel.LOW)) {
        const req = this.approval.requestApproval(
          currentNode.name,
          `需要审批: ${currentNode.name}`,
          currentNode.riskLevel ?? RiskLevel.LOW
        );

        this.checkpoint.save(this.sm.getState(), currentNode.id, this.state.data);
        this.state.status = "awaiting_approval";

        console.log(
          `[Approval] 等待审批: ${currentNode.name} (${req.riskLevel}), ID: ${req.id}`
        );

        return this.state;
      }

      this.sm.transition("PLAN_CREATED");
      this.state.currentStep = currentNode.id;

      try {
        const result = await currentNode.execute(this.state);
        this.state.data = { ...this.state.data, ...result };

        this.checkpoint.save(
          this.sm.getState(),
          currentNode.id,
          this.state.data
        );

        this.sm.transition("EXECUTION_DONE");
        this.sm.transition("REFLECTION_PASSED");
      } catch {
        this.state.status = "failed";
        this.sm.transition("ERROR");
        console.log(`[Checkpoint] 崩溃于 ${currentNode.id}, 检查点已保存`);
        return this.state;
      }

      const nextId: string | null = currentNode.next?.(this.state) ?? null;
      currentNode = nextId ? (this.nodeMap.get(nextId) ?? null) : null;
    }

    this.checkpoint.clear();
    this.state.status = "completed";
    return this.state;
  }

  getState(): WorkflowState {
    return this.state;
  }

  getMachineState() {
    return this.sm.getState();
  }
}
