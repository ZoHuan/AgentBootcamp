import { EvalCase } from "./dataset";

export interface EvalResult {
  caseId: string;
  passed: boolean;
  score: number;
  reason?: string;
}

export interface EvalSummary {
  total: number;
  passed: number;
  failed: number;
  successRate: number;
  results: EvalResult[];
}

interface AgentOutput {
  goal?: string;
  toolsUsed?: string[];
}

export function evaluate(testCase: EvalCase, output: AgentOutput): EvalResult {
  let score = 0;
  const reasons: string[] = [];

  if (testCase.expectedGoal && output.goal) {
    if (output.goal.toLowerCase().includes(testCase.expectedGoal.toLowerCase())) {
      score += 0.5;
    } else {
      reasons.push(`Goal 不匹配: 期望包含 "${testCase.expectedGoal}"`);
    }
  }

  if (testCase.expectedTools && output.toolsUsed) {
    const allFound = testCase.expectedTools.every((t) =>
      output.toolsUsed!.some((u) => u.toLowerCase().includes(t.toLowerCase()))
    );
    if (allFound) {
      score += 0.5;
    } else {
      reasons.push(`Tool 不匹配: 期望 ${testCase.expectedTools.join(", ")}`);
    }
  }

  return {
    caseId: testCase.id,
    passed: score >= 0.5,
    score,
    reason: reasons.length > 0 ? reasons.join("; ") : undefined,
  };
}

export function evaluateAll(
  dataset: EvalCase[],
  outputs: Record<string, AgentOutput>
): EvalSummary {
  const results = dataset.map((tc) => evaluate(tc, outputs[tc.id] || {}));
  const passed = results.filter((r) => r.passed).length;
  const total = results.length;

  return {
    total,
    passed,
    failed: total - passed,
    successRate: total > 0 ? Math.round((passed / total) * 100) : 0,
    results,
  };
}
