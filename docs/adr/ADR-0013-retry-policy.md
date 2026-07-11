# ADR-0013 Retry Policy

## 为什么需要 Retry Policy？

Agent 在调用 LLM 与 Tool 时会遇到网络异常、超时、模型格式错误等临时故障。Retry Policy 定义了重试策略——最多几次、等多久、哪些错误可以重试。

## 为什么 Retry 是 Runtime 的能力而不是 Tool 的能力？

每个 Tool 自己写重试逻辑会导致代码重复、策略不一致。Runtime 层统一 Retry，所有 Tool 复用，且以后可以升级为 Circuit Breaker 或 Dead Letter Queue。

## 当前方案

```
RetryPolicy { maxRetries, initialDelay, multiplier, retryable }
RetryManager.retry(task, policy) → Exponential Backoff
ErrorHandler.classify(error) → retry | recover | throw
recover(task, policy) → RetryManager + ErrorHandler 组合
```

## 后续扩展

- Circuit Breaker：连续失败 N 次后熔断
- Dead Letter Queue：最终失败的任务进入队列
- Checkpoint Recovery：失败后从断点恢复
