import { Trace } from "./trace";

export function printTimeline(trace: Trace): string {
    const lines = ["Trace Timeline", "--------------------------------"];

  for (const span of trace.spans) {
    const duration = span.endedAt
      ? `${span.endedAt.getTime() - span.startedAt.getTime()}ms`
      : "running";
    const status = span.status === "success" ? "✓" : span.status === "failed" ? "✗" : "→";
    lines.push(`${span.name.padEnd(20)} ${duration.padStart(8)} [${status}]`);
  }

  return lines.join("\n");
}
