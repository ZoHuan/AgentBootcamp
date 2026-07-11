import { RetryPolicy } from "./retry-policy";
import { RetryManager } from "./retry-manager";
import { ErrorHandler } from "./error-handler";

const errorHandler = new ErrorHandler();
const retryManager = new RetryManager();

export async function recover<T>(
  task: () => Promise<T>,
  policy: RetryPolicy
): Promise<T> {
  try {
    return await retryManager.retry(task, policy);
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    const action = errorHandler.classify(error);

    if (action === "recover") {
      console.warn(`[Recovery] 降级处理: ${error.message}`);
      throw error;
    }

    throw error;
  }
}
