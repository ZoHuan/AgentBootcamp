# ADR-0007 State Machine + Checkpoint

## 为什么需要 State Machine？

Workflow 只管节点流转（from → to），不管 Agent 整体处于什么生命周期阶段。State Machine 引入显式状态和转换规则，让 Agent 的行为可预测、可追踪。

## 为什么需要 Checkpoint？

Agent 执行可能因为网络、LLM 超时等原因中断。Checkpoint 在执行过程中拍快照（当前状态 + 节点 + 数据），崩溃后从断点恢复，不从头重跑。对于长时间运行的任务尤其关键。

## Memory 和 Checkpoint 有什么区别？

- Memory：给 LLM 看的——对话上下文、用户偏好
- Checkpoint：给引擎用的——执行现场、断点位置

两者独立存储、独立用途。

## 当前方案

```
StateMachine (lib/state/machine.ts)
├── transition(event) → 查表跳转
└── getState() → 当前阶段

CheckpointManager (lib/state/checkpoint.ts)
├── save(state, node, data) → 拍快照
├── load() → 恢复最近存档
└── clear() → 清空

WorkflowEngine
├── 每步执行后自动 save checkpoint
├── start() 时自动 load 恢复
└── 全部完成后 clear
```

## 后续扩展

- 分布式执行（checkpoint 存到 Redis/DB）
- Human-in-the-loop（某步通过后才继续）
- 长运行任务的自动重试
