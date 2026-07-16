export enum RiskLevel { LOW = "low", MEDIUM = "medium", HIGH = "high" }
export interface RiskRule { toolName: string; riskLevel: RiskLevel; requiresApproval: boolean }
export const defaultRules: RiskRule[] = [{ toolName: "get_weather", riskLevel: RiskLevel.LOW, requiresApproval: false }, { toolName: "delete_repo", riskLevel: RiskLevel.HIGH, requiresApproval: true }];
