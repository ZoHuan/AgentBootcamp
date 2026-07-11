# Day 20 — Recovery Layer

## 今天学到的

- **为什么不是所有错误都应该 Retry**：超时/网络可以重试（临时问题），但余额不足/数据格式错误重试没用。ErrorHandler 按关键词分类：retry / recover / throw
- **Exponential Backoff 的作用**：每次重试等待时间翻倍（1s → 2s → 4s），避免频繁重试把下游打崩
- **Retry 和 Checkpoint 的区别**：Retry 是"等一下再来一次"，Checkpoint 是"从这里继续"——前者处理瞬时故障，后者处理崩溃恢复

## 完成内容

- `lib/recovery/retry-policy.ts` — RetryPolicy 接口（maxRetries/delay/multiplier/retryable）
- `lib/recovery/retry-manager.ts` — RetryManager（指数退避 + RetryEvent 日志）
- `lib/recovery/error-handler.ts` — ErrorHandler（错误分类）
- `lib/recovery/recovery.ts` — recover() 组合入口

## 架构

```
recover(task, policy)
  → RetryManager.retry() + ErrorHandler.classify()
  → retry | recover | throw
```

## 收获

- 有副作用的 Tool（支付、邮件）不能盲目重试——需要幂等键保护
- Retry 是 Runtime 的能力，不是 Tool 的能力——统一策略，所有模块复用
- RetryEvent 为 Tracing 预留了数据接口
