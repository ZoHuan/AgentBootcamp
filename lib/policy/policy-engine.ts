import { RiskRule, defaultRules } from "./risk-policy";
export class PolicyEngine { private rules: RiskRule[]; constructor(rules: RiskRule[] = defaultRules) { this.rules = rules; } evaluate(toolName: string): RiskRule | undefined { return this.rules.find((r) => r.toolName === toolName); } }
