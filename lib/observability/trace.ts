import { Span } from "./span";

export interface Trace {
  id: string;
  workflowName: string;
  startedAt: Date;
  endedAt?: Date;
  spans: Span[];
}
