import { Tool } from "./tool";
import { ToolRegistry } from "./registry";

export interface ToolCandidate {
  tool: Tool;
  score: number;
}

export interface ToolRouter {
  route(query: string): ToolCandidate[];
}

export class KeywordRouter implements ToolRouter {
  private registry: ToolRegistry;

  constructor(registry: ToolRegistry) {
    this.registry = registry;
  }

  route(query: string): ToolCandidate[] {
    const lower = query.toLowerCase();
    const all = this.registry.getAll();

    const candidates = all
      .map((t) => {
        let score = 0;
        if (t.tags?.some((tag) => lower.includes(tag))) score += 0.8;
        if (lower.includes(t.name.toLowerCase())) score += 0.5;
        if (t.description.toLowerCase().includes(lower)) score += 0.2;
        return { tool: t, score };
      })
      .filter((c) => c.score > 0);

    candidates.sort((a, b) => b.score - a.score);

    return candidates;
  }
}
