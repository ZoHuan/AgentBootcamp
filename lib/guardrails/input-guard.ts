import { Guardrail, GuardrailResult } from "./guardrail";

const blacklist = ["hack", "exploit", "attack"];

export class InputGuardrail implements Guardrail<string> {
  async check(input: string): Promise<GuardrailResult> {
    if (!input || input.trim().length === 0) {
      return { passed: false, reason: "输入不能为空" };
    }

    if (input.length > 1000) {
      return { passed: false, reason: "输入超过长度限制" };
    }

    const lower = input.toLowerCase();
    for (const word of blacklist) {
      if (lower.includes(word)) {
        return { passed: false, reason: `输入包含禁止关键词: ${word}` };
      }
    }

    return { passed: true };
  }
}
