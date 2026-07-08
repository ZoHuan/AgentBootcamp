# ADR-0005 Multi-Step Planning

## 为什么 Plan 要拆成 Step？

复杂任务需要拆解——"分析意图 → 查询天气 → 生成回答"。不拆成 Step，Agent 只能一把梭，无法控制执行顺序、无法追踪进度、无法在中间步骤失败时重试。

## 为什么 Status 放 Step 而不是 Runtime？

Runtime 是调度器，不应追踪执行状态。每个 Step 自己携带 `pending → running → completed | failed`，Runtime 只问 `nextStep(plan)` 就知道下一步做什么。这为 Workflow、Human Approval、Replanning 提供了基础——这些模块不需要知道 Runtime 内部逻辑，只看 Step 状态。

## 当前方案

```
Plan { id, goal, steps: PlanStep[] }
PlanStep { id, title, description, tool?, status }
nextStep(plan) → PlanStep | null    // 找第一个 pending 的步骤
```

Runtime 循环：`while (step = nextStep(plan)) { 执行 step → 更新状态 → 继续 }`

## 后续扩展：如何支持 DAG？

线性 Step 目前的限制：Step2 必须在 Step1 之后。非线性 Workflow（DAG）需要：
- Step 增加 `dependsOn: string[]`（前置步骤 ID 列表）
- `nextStep()` 检查所有依赖已完成才返回
- 支持并行 Step（当前只串行）

这为后续 Workflow Engine 奠定基础。
