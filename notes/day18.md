# Day 18 — LLM Planning

## 今天学到的

- **为什么 Planner 输出必须结构化**：LLM 输出 JSON 才能被程序消费——`validate()` 检查 goal/steps/id，不合格就重试。自由文本无法驱动 Workflow
- **Planner 和 Workflow 的区别**：Planner 决定"做什么"（生成 Plan），Workflow 决定"怎么做"（节点路由 + 条件分支）
- **为什么 LLM 负责规划，代码负责执行**：LLM 灵活但不稳定（需要 validate + retry），代码确定且可控。分工——LLM 出想法，代码落地执行

## 完成内容

- `lib/planning/plan.ts` — Plan + PlanStep 类型
- `lib/planning/validator.ts` — validate() 校验结构
- `lib/planning/planner.ts` — LLMPlanner，Prompt → JSON → validate → retry
- Runtime 接入 LLMPlanner，替代旧规则版 Planner
- 类型统一引用 `lib/planning/plan.ts`

## 架构

```
User Goal → LLM Planner → Plan (JSON) → validate → Workflow → Executor → Reflection
```

## 收获

- 旧 Planner 是死模板，新 Planner 由 LLM 动态生成
- 校验 + 重试是 LLM 输出的安全保障
- Planner → Workflow → Executor 三层职责清晰
