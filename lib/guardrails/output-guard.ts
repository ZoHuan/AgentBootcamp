import { Guardrail, GuardrailResult } from "./guardrail";

const sensitiveWords = ["password", "secret", "token"];

export class OutputGuardrail implements Guardrail<string> {
  async check(output: string): Promise<GuardrailResult> {
    if (!output || output.trim().length === 0) {
      return { passed: false, reason: "输出不能为空" };
    }

    if (output.length > 5000) {
      return { passed: false, reason: "输出超过长度限制" };
    }

    const lower = output.toLowerCase();
    for (const word of sensitiveWords) {
      if (lower.includes(word)) {
        return { passed: false, reason: `输出包含敏感词: ${word}` };
      }
    }

    return { passed: true };
  }
}
