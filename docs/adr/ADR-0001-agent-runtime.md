# ADR-0001 Agent Runtime

## 为什么需要 Runtime？

Day 7 的 route.ts 直接调 LLM + 判断 tool_calls + 执行工具 + 再调 LLM，所有逻辑堆在 API 处理器里。随着工具增加，route.ts 会不断膨胀，不可维护。

## 为什么不放 Route？

Route 是 HTTP 边界层，职责是接收请求、返回响应。Tool 调用、Memory 管理、Planner 调度这些是 Agent 内部逻辑，不应污染边界层。

## 当前方案

```
route.ts → AgentRuntime.run()
              ├── Memory.formatHistory() → 注入上下文
              ├── Planner.createPlan()    → 制定计划
              ├── Executor.askLLM()       → 调 LLM + 执行工具
              └── Executor.respond()      → 流式返回
```

## 后续扩展

- 支持 Multi-turn Planning（多轮计划）
- 支持 Reflection（反思 + 重规划）
- 支持 Workflow（多步骤编排）
