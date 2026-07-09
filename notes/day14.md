# Day 14 — State Machine + Checkpoint

## 今天学到的

- **Workflow 和 State Machine 的区别**：Workflow 负责"怎么流转"（节点 + 路由），State Machine 负责"现在在哪里"（IDLE→PLANNING→EXECUTING→REFLECTING→COMPLETED）
- **为什么 Agent 需要 Checkpoint**：执行可能因网络、LLM 超时中断。Checkpoint 拍快照，崩溃后从断点恢复不重跑
- **Memory 和 Checkpoint 的区别**：Memory 存对话上下文（给 LLM），Checkpoint 存执行现场（给引擎恢复用）

## 完成内容

- `lib/state/transition.ts` — AgentState（6 个生命周期状态）+ TransitionEvent
- `lib/state/machine.ts` — StateMachine，transition 表驱动
- `lib/state/checkpoint.ts` — CheckpointManager（save/load/clear）
- WorkflowEngine 集成 StateMachine + CheckpointManager
- 崩溃恢复：每步成功后 save，失败时自动存档，重跑 start() 自动恢复

## 架构

```
Planner       → 想做什么
Workflow      → 怎么流转
StateMachine  → 现在在哪里
Checkpoint    → 断点恢复
```

## 收获

- 生产级 Agent 核心骨架成型：Planner + Workflow + StateMachine + Checkpoint
- 状态机用查表（transitionTable）代替 if/else——加状态只改表
- Engine 内三条线并行：WorkflowState（数据）、StateMachine（阶段）、Checkpoint（存档）
