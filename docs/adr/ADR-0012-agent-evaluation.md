# ADR-0012 Agent Evaluation

## 为什么需要 Evaluation？

Agent 引入 Planning、Tool Calling 和 Workflow 后，不能只靠"感觉"判断质量。需要系统化评测——检查 Plan 是否合理、Tool 是否选对、最终答案是否正确。否则改了 Prompt 后 Agent 退化了都不知道。

## 为什么不只测最终答案？

Agent 的过程同样重要——Plan 少了一步、Tool 选错、陷入死循环，这些问题最终答案可能看不出，但行为已经退化。Component、Trajectory、Outcome 三层评测分别覆盖不同维度。

## 当前方案

```
EvalCase { input, expectedGoal?, expectedTools? }
evaluate(case, output) → EvalResult { passed, score, reason }
evaluateAll(dataset, outputs) → EvalSummary { total, passed, successRate }
generateReport(summary, metrics) → 文本报告
```

评分规则：goal 匹配 +0.5，tools 匹配 +0.5。

## 后续扩展

- LLM-as-a-Judge：让 LLM 自己评估答案质量
- Trajectory Evaluation：检查整个执行过程
- CI 集成：每次 push 自动跑评测
