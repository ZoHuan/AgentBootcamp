# Day 19 — Agent Evaluation

## 今天学到的

- **为什么 Agent Evaluation 不等于单元测试**：普通测试只检查输出，Agent 要检查 Planning、Tool Calling、Workflow 全过程——Plan 是否合理、Tool 是否选对、有没有死循环
- **Component、Trajectory、Outcome 三层评测**：Component 查单个模块（Planner 输出），Trajectory 查执行过程（有没有重复调用），Outcome 查最终结果（是否满足用户）
- **为什么先设计 Metrics，再优化 Prompt**：没有指标就没法衡量优化效果——改了 Prompt 成功率从 80% 掉到 60%，不看数字根本不知道

## 完成内容

- `lib/evaluation/dataset.ts` — EvalCase + evalDataset（5 条用例）
- `lib/evaluation/evaluator.ts` — evaluate / evaluateAll（goal + tool 评分）
- `lib/evaluation/metrics.ts` — Metrics 指标定义
- `lib/evaluation/report.ts` — generateReport 生成文本报告

## 架构

```
Dataset → Evaluator → EvalResult → Report
             ↑
         Agent Output
```

## 收获

- 生产级 Agent 必须有评测——"不能上线不知道好不好用"
- 评分规则简单但有效：goal +0.5，tools +0.5
- 架构预留了 Trajectory 和 LLM-as-a-Judge 的扩展空间
