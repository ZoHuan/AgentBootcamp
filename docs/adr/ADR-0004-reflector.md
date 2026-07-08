# ADR-0004 Reflector

## 为什么需要 Reflector？

LLM 回答不是每次都正确。可能返回空内容、工具调用失败、数据不完整。Reflector 负责评估每次执行结果的质量，决定是否需要重试。

## 为什么 Retry 不放 Executor？

Executor 职责是执行（调 LLM + 运行工具），不应包含评估逻辑。如果 Executor 自己做 Retry，它变成了"执行 + 判断"的混合体，职责不清。Reflector 独立后，未来可以升级为 LLM 驱动的评估器，Executor 不需要改动。

## 为什么 Reflection 独立？

Runtime 只做调度（编排 Planner → Executor → Reflector 的顺序），不写推理逻辑。Reflection 是 Agent 的推理能力——"我的回答质量达标吗？需要重来吗？"

这和 Planner（"我要怎么做？"）是两件不同的事：
- Planner = 事前规划
- Reflector = 事后评估

## 当前方案

```
Reflector (lib/agent/reflector.ts)
├── evaluate(fullText) → Evaluation
├── Evaluation { success, confidence, reason, retry }
└── 错误检测：扫描 error/failed/500/timeout 等关键词
```

Runtime 循环：Plan → Execute → Reflect → 如果 retry → 重新 Execute（最多 2 次）

## 后续扩展

- LLM-driven Evaluation：让 LLM 自己评估回答质量
- 评分细化：准确性、完整性、安全性分维度评估
- 自动纠错：检测到具体问题后，自动修正 prompt 重新生成
