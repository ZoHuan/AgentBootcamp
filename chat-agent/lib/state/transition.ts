export type AgentState =
  | "IDLE"
  | "PLANNING"
  | "EXECUTING"
  | "REFLECTING"
  | "COMPLETED"
  | "FAILED";

export type TransitionEvent =
  | "START"
  | "PLAN_CREATED"
  | "EXECUTION_DONE"
  | "REFLECTION_PASSED"
  | "REFLECTION_FAILED"
  | "ERROR"
  | "RESET";
