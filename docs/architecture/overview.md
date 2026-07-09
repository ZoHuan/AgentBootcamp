# Architecture Overview

## Agent Runtime v0.1.0

```
User Request
    │
    ▼
AgentRuntime (调度中心)
    │
    ├── Planner      → 制定多步骤计划
    ├── Workflow     → 节点路由 + 条件分支
    ├── Executor     → 调用 LLM + 执行工具
    ├── Reflector    → 评估结果 + 触发重试
    ├── Memory       → 上下文管理
    └── StateMachine → 生命周期管理
         │
         ▼
    Checkpoint       → 执行快照 + 崩溃恢复
```

## 核心模块

### Planner（lib/runtime/planner.ts）
将用户意图分解为可执行的 Plan（Goal + Steps）。

### Workflow Engine（lib/workflow/）
节点路由 + 条件分支。`next(state)` 根据执行结果决定下一步。

### Executor（lib/runtime/executor.ts）
LLM 通信层。`askLLM()` 调用 LLM + 工具，`respond()` 流式返回。

### Reflector（lib/runtime/reflector.ts）
评估执行结果。检测错误关键词，决定重试（最多 2 次）。

### Memory（lib/memory/）
上下文管理。`save/load/clear/formatHistory()`，限制 10 条。

### State Machine（lib/state/）
生命周期：IDLE → PLANNING → EXECUTING → REFLECTING → COMPLETED。

### Checkpoint（lib/state/checkpoint.ts）
执行快照。每步成功后保存，崩溃后自动恢复。

## 设计思想

- 职责分离：每模块只做一件事
- 可观测：StateMachine + Checkpoint 提供完整追踪
- 可恢复：Checkpoint 支持断点续跑
- 可扩展：加 Tool 不改 Runtime，加 State 不改 Engine
