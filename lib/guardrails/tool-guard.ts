import { Guardrail, GuardrailResult } from "./guardrail";
import { RiskLevel } from "@/lib/approval/approval";

interface ToolInfo {
  name: string;
  riskLevel: RiskLevel;
}

const allowedTools = new Set(["get_weather"]);

export class ToolGuardrail implements Guardrail<ToolInfo> {
  async check(tool: ToolInfo): Promise<GuardrailResult> {
    if (!allowedTools.has(tool.name)) {
      return { passed: false, reason: `未知工具: ${tool.name}` };
    }

    if (tool.riskLevel === RiskLevel.HIGH) {
      return { passed: false, reason: `高风险工具需要审批: ${tool.name}` };
    }

    return { passed: true };
  }
}
