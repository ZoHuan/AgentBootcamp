interface Checkpoint {
  id: string;
  state: string;
  node: string;
  data: Record<string, unknown>;
  timestamp: number;
}

export class CheckpointManager {
  private checkpoints: Checkpoint[] = [];

  save(state: string, node: string, data: Record<string, unknown>): string {
    const cp: Checkpoint = {
      id: `cp_${Date.now()}`,
      state,
      node,
      data,
      timestamp: Date.now(),
    };
    this.checkpoints.push(cp);
    return cp.id;
  }

  load(): Checkpoint | null {
    return this.checkpoints[this.checkpoints.length - 1] ?? null;
  }

  clear(): void {
    this.checkpoints = [];
  }
}
