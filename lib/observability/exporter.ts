import { Trace } from "./trace";

export function exportToJson(trace: Trace): string {
  return JSON.stringify(trace, null, 2);
}
