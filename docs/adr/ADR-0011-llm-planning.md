# ADR-0011 LLM Planning

## 为什么需要 LLM Planning？

静态规则版 Planner 只能处理预设场景。LLM 驱动的 Planner 可以根据任意目标动态生成步骤，适应多变任务。

## 为什么不继续用规则版？

规则版需要穷举所有可能的用户意图，不可扩展。LLM 虽然概率性输出、需要校验，但灵活性和适应性远超过规则。

## 当前方案

```
LLMPlanner.createPlan(goal)
  → 调 LLM（PLANNING_PROMPT）→ JSON 输出
  → 清洗（去 markdown 包裹）→ JSON.parse
  → validate(plan) 校验结构
  → 成功 → Plan | 失败 → 重试（最多 3 次）
```

Runtime 已接入 LLMPlanner，替代旧规则版 Planner。

## 后续扩展

- Plan Repair：校验失败时自动修正
- Self Reflection：LLM 自我评估计划质量
- Dynamic Workflow：根据执行结果动态调整后续步骤
