import { Plan } from "./plan";

export function validate(plan: unknown): plan is Plan {
  if (!plan || typeof plan !== "object") return false;

  const p = plan as Record<string, unknown>;

  if (typeof p.goal !== "string" || p.goal.length === 0) return false;
  if (!Array.isArray(p.steps) || p.steps.length === 0) return false;

  for (const step of p.steps) {
    if (!step || typeof step !== "object") return false;
    const s = step as Record<string, unknown>;
    if (typeof s.id !== "string" || s.id.length === 0) return false;
    if (typeof s.description !== "string") return false;
    if (typeof s.status !== "string") return false;
  }

  return true;
}
