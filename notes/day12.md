# Day 12 — Multi-Step Planning（多步骤规划）

## 今天学到的

Plan 不应该只有一个 Goal——复杂任务需要拆成多个 Step，逐步执行。

- Planner 返回 Goal + Steps，而非一步跳到大纲
- Executor 按 Step 逐步执行：`nextStep()` → 执行 → 更新状态 → 继续
- Step 的 `status` 是 Workflow/Retry/Human Approval 的基础

## 完成内容

- `lib/agent/types.ts` — 统一类型（StepStatus, PlanStep, Plan, Evaluation）
- `lib/agent/plan.ts` — `nextStep()` 函数，自动找下一个 pending 步骤
- Planner 返回多步骤 Plan，每步含 id/title/description/tool/status
- Runtime 用 `while (step = nextStep(plan))` 循环逐步执行
- 控制台打印：`[✓] Step1 [✓] Step2 [✓] Step3`
- ADR-0005 记录设计决策

## 架构

```
Runtime 循环:
  while (step = nextStep(plan)) {
    step.status = "running"
    askLLM + respond + evaluate
    step.status = "completed" | "failed"
  }
```

## 收获

- 线性 Step → 非线性 DAG 的演进方向（dependsOn, 并行执行）
- `nextStep()` 让 Runtime 不依赖步骤数量和顺序
- types.ts 统一管理所有接口，避免循环引用
