import { EvalSummary } from "./evaluator";
import { Metrics } from "./metrics";

export function generateReport(summary: EvalSummary, metrics: Metrics): string {
  return [
    "Evaluation Summary",
    "==================",
    `Cases: ${summary.total}`,
    `Passed: ${summary.passed}`,
    `Failed: ${summary.failed}`,
    `Success Rate: ${summary.successRate}%`,
    `Average Latency: ${metrics.averageLatency}ms`,
    `Tool Accuracy: ${Math.round(metrics.toolSelectionAccuracy * 100)}%`,
    "",
    "Details",
    "-------",
    ...summary.results.map(
      (r) => `[${r.passed ? "✓" : "✗"}] ${r.caseId}: score=${r.score}${r.reason ? ` (${r.reason})` : ""}`
    ),
  ].join("\n");
}
