export type AgentState = "IDLE" | "PLANNING" | "EXECUTING" | "REFLECTING" | "COMPLETED" | "FAILED";
export interface ExecutionContext { traceId?: string; userId?: string; metadata?: Record<string, unknown>; }
