import { RetryPolicy } from "./retry-policy";

export type RetryEventType = "attempt" | "retry" | "success" | "failed";

export interface RetryEvent {
  type: RetryEventType;
  attempt: number;
  delay?: number;
  error?: string;
}

export interface RetryResult<T> {
  result: T;
  events: RetryEvent[];
}

export class RetryManager {
  async retry<T>(task: () => Promise<T>, policy: RetryPolicy): Promise<T> {
    let delay = policy.initialDelay;

    for (let attempt = 0; attempt <= policy.maxRetries; attempt++) {
      console.log(`[Retry] Attempt ${attempt + 1}`);

      try {
        const result = await task();
        console.log(`[Retry] Attempt ${attempt + 1} → Success`);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));

        if (attempt === policy.maxRetries || !policy.retryable(error)) {
          console.error(`[Retry] Attempt ${attempt + 1} → Failed: ${error.message}`);
          throw error;
        }

        console.warn(`[Retry] Attempt ${attempt + 1} → ${error.message}, ${delay}ms 后重试`);
        await this.sleep(delay);
        delay *= policy.multiplier;
      }
    }

    throw new Error("RetryManager: 不应该到达这里");
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
