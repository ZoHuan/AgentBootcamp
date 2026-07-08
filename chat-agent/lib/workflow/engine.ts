import { WorkflowState } from "./state";
import { WorkflowNode } from "./node";

export class WorkflowEngine {
  private nodeMap: Map<string, WorkflowNode>;
  private state: WorkflowState;

  constructor(nodes: WorkflowNode[]) {
    this.nodeMap = new Map(nodes.map((n) => [n.id, n]));
    this.state = { currentStep: "", status: "running", data: {} };
  }

  async start(): Promise<WorkflowState> {
    const firstNode = Array.from(this.nodeMap.values())[0];
    if (!firstNode) {
      this.state.status = "completed";
      return this.state;
    }

    let currentNode: WorkflowNode | null = firstNode;

    while (currentNode) {
      this.state.currentStep = currentNode.id;

      try {
        const result = await currentNode.execute(this.state);
        this.state.data = { ...this.state.data, ...result };
      } catch {
        this.state.status = "failed";
        return this.state;
      }

      const nextId: string | null = currentNode.next?.(this.state) ?? null;
      currentNode = nextId ? (this.nodeMap.get(nextId) ?? null) : null;
    }

    this.state.status = "completed";
    return this.state;
  }

  getState(): WorkflowState {
    return this.state;
  }
}
