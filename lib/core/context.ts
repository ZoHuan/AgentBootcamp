import { ExecutionContext } from "./types/agent";
export function createContext(traceId?: string): ExecutionContext { return { traceId: traceId ?? crypto.randomUUID(), metadata: {} }; }
