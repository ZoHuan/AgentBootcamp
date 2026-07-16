export class AgentError extends Error { constructor(message: string, public code: string) { super(message); this.name = "AgentError"; } }
export class ToolError extends AgentError { constructor(message: string) { super(message, "TOOL_ERROR"); } }
export class PlannerError extends AgentError { constructor(message: string) { super(message, "PLANNER_ERROR"); } }
