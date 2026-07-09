import { AgentState, TransitionEvent } from "./transition";

const transitionTable: Record<AgentState, Partial<Record<TransitionEvent, AgentState>>> = {
  IDLE:       { START: "PLANNING", RESET: "IDLE", ERROR: "FAILED" },
  PLANNING:   { PLAN_CREATED: "EXECUTING", RESET: "IDLE", ERROR: "FAILED" },
  EXECUTING:  { EXECUTION_DONE: "REFLECTING", RESET: "IDLE", ERROR: "FAILED" },
  REFLECTING: { REFLECTION_PASSED: "COMPLETED", REFLECTION_FAILED: "EXECUTING", RESET: "IDLE", ERROR: "FAILED" },
  COMPLETED:  { RESET: "IDLE", ERROR: "FAILED" },
  FAILED:     { RESET: "IDLE" },
};

export class StateMachine {
  private state: AgentState;

  constructor(initialState: AgentState = "IDLE") {
    this.state = initialState;
  }

  transition(event: TransitionEvent): AgentState {
    const next = transitionTable[this.state]?.[event];
    if (!next) throw new Error(`无效过渡: ${this.state} → ${event}`);
    this.state = next;
    return this.state;
  }

  getState(): AgentState {
    return this.state;
  }
}
