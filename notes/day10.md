# Day 10 — Planning（规划能力）

## 今天学到的

Planning 的本质：Agent 把复杂任务拆成多个可执行步骤，先列计划再逐步执行。

Runtime 不应负责 Planning——Runtime 是调度中心，Planner 负责思考，Executor 负责执行。

## 完成内容

- `lib/agent/planner.ts` — Planner 类，`createPlan()` 生成 Plan（Goal + Steps）
- `lib/agent/executor.ts` — Executor 类，`askLLM()` 调 LLM + 执行工具，`respond()` 流式输出
- Runtime 重构：`plan/execute/respond` 三个方法删除，改为调 `planner + executor`
- Plan Logger：控制台打印计划结构
- ADR-0001/0002/0003 补齐

## 架构演变

```
Day 8:  route.ts → Runtime(plan/execute/respond)
Day 9:  route.ts → Runtime + Memory
Day 10: route.ts → Runtime → Planner + Executor + Memory
```

## 收获

- 职责分离：每个模块只做一件事
- ADR 思维：记录为什么这样设计，而不只是写代码
- `createPlan()` 目前是规则驱动，未来可升级为 LLM 驱动
