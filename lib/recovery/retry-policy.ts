export interface RetryPolicy {
  maxRetries: number;
  initialDelay: number;
  multiplier: number;
  retryable(error: Error): boolean;
}
