import { Guardrail, GuardrailResult } from "./guardrail";

export class GuardrailManager {
  async run<T>(guards: Guardrail<T>[], input: T): Promise<GuardrailResult> {
    for (const guard of guards) {
      const result = await guard.check(input);
      if (!result.passed) return result;
    }
    return { passed: true };
  }
}
