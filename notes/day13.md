# Day 13 — Workflow Engine

## 今天学到的

- **Workflow vs Agent**：Agent 由 LLM 自由决定下一步——灵活但不可控。Workflow 是预定义节点 + 条件路由——LLM 只在节点内部参与，流程由 Engine 控制
- **为什么不能完全依赖 LLM 决定流程**：LLM 可能走错分支、跳过步骤、死循环。企业场景需要审计追踪、错误恢复、人工审批
- **WorkflowState 为什么独立**：State 是节点间的共享上下文，独立后 Memory、Reflection、Human Approval 都可以读取同一个 State

## 完成内容

- `lib/workflow/state.ts` — WorkflowState（currentStep / status / data）
- `lib/workflow/node.ts` — WorkflowNode（id / name / execute / next）
- `lib/workflow/engine.ts` — WorkflowEngine（while 循环 + 条件分支）
- `next` 函数：节点根据 state.data 返回下一个节点 id，实现条件跳转

## 架构

```
WorkflowEngine.start()
  while (currentNode) {
    ① execute(state)   → 调 LLM
    ② merge result     → state.data
    ③ next(state)      → 下个节点 id / null 结束
  }
```

## 收获

- 为什么 LangGraph 使用 Graph？Agent 本质是 State + Transition + Node
- 为什么企业 Agent 不应该完全自由？可预测 + 可调试 + 可恢复
- `next` 不是 LLM 决定的——纯代码逻辑，LLM 只在 `execute` 参与
