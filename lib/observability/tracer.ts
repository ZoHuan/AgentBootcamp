import { Trace } from "./trace";
import { Span } from "./span";

export class Tracer {
  private traces = new Map<string, Trace>();
  private activeTrace: Trace | null = null;

  startTrace(workflowName: string): Trace {
    const trace: Trace = {
      id: crypto.randomUUID(),
      workflowName,
      startedAt: new Date(),
      spans: [],
    };
    this.traces.set(trace.id, trace);
    this.activeTrace = trace;
    return trace;
  }

  endTrace(): void {
    if (this.activeTrace) {
      this.activeTrace.endedAt = new Date();
      this.activeTrace = null;
    }
  }

  startSpan(name: string): Span {
    if (!this.activeTrace) this.startTrace("unknown");

    const span: Span = {
      id: crypto.randomUUID(),
      name,
      startedAt: new Date(),
      status: "running",
    };
    this.activeTrace!.spans.push(span);
    return span;
  }

  endSpan(span: Span, success: boolean): void {
    span.endedAt = new Date();
    span.status = success ? "success" : "failed";
  }

  getTrace(id: string): Trace | undefined {
    return this.traces.get(id);
  }
}
