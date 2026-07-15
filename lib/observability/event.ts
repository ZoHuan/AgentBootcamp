export interface TraceEvent {
  spanId: string;
  name: string;
  timestamp: Date;
  data?: Record<string, unknown>;
}
