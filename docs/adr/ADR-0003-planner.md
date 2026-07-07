# ADR-0003 Planner

## 为什么需要 Planner？

Agent 面对复杂任务时，不应"想到什么做什么"，而应先列出计划再逐步执行。Planner 负责生成可执行步骤，Executor 负责按步骤执行。

## 为什么不放 Runtime？

Runtime 是调度中心，负责编排 Planner、Executor、Memory 的协作。Planning 是独立的思考过程，职责分离后，未来可以替换为 LLM 驱动的 Planner 而不影响其他模块。

## 当前方案

```
Planner (lib/agent/planner.ts)
├── Plan { goal, steps[] }
├── PlanStep { description, status: pending|running|done }
└── createPlan(input) → Plan
```

目前 Planner 是规则驱动（关键词匹配），`createPlan()` 返回的 Plan 暂未控制 Executor 的行为——这是后续迭代方向。

## 后续扩展

- LLM-driven Planner：用 LLM 自动分解复杂任务
- Multi-step Execution：Executor 按 Plan 的 steps 逐步执行
- Plan Status Tracking：运行时更新 step 状态
- Re-planning：执行失败后自动调整计划
