# Day 23 — Guardrails

## 今天学到的

- **Guardrail 和 Approval 的区别**：Guardrail 是自动拦截（规则驱动，不需要人），Approval 是人工确认（需要人做决定）。Guardrail 拦技术违规，Approval 管业务风险
- **为什么 Tool Guardrail 比 Input Guardrail 更重要**：Input 只拦恶意输入，Tool 拦危险执行——发送 500 封邮件、删除仓库、Git Push。Input 错误最多浪费一次 LLM 调用，Tool 错误可能造成业务灾难
- **为什么企业需要多层 Guardrail**：分层防御——Input 拦入口、Tool 拦执行、Output 拦出口。一层失效还有其他层兜底

## 完成内容

- `lib/guardrails/guardrail.ts` — Guardrail<T> 接口
- `lib/guardrails/input-guard.ts` — 空/超长/黑名单
- `lib/guardrails/tool-guard.ts` — 未知工具/高风险拦截
- `lib/guardrails/output-guard.ts` — 空/超长/敏感词
- `lib/guardrails/manager.ts` — 依次执行 guard 链
- `lib/guardrails/policy.ts` — 策略配置
- Runtime + Executor 接入三层 Guardrail

## 架构

```
User → InputGuard → Planner → Executor → ToolGuard → OutputGuard → Answer
```

## 收获

- Guardrail 在 Planner 前运行——无效请求不浪费 LLM Token
- Guardrail 拒绝应记录 Trace，进入 Evaluation 报告
- Guardrail 与 Approval 共存：Guardrail 先拦截，Approval 后确认
