export interface GuardrailResult {
  passed: boolean;
  reason?: string;
}

export interface Guardrail<T> {
  check(input: T): Promise<GuardrailResult>;
}
