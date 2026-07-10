# ADR-0010 Tool Router

## 为什么需要 Tool Router？

随着 Tool 数量增长，直接把全部 Tool 交给 LLM 会导致 Prompt 过长、Token 成本高、工具描述互相干扰。Router 负责根据用户输入预筛选，只给 LLM 看候选工具。

## 为什么 Router 不应该直接执行 Tool？

Router 的职责是"缩小候选范围"，不是"最终决策"。真正决定调用哪个工具的应该是 Planner / LLM。如果 Router 直接执行，相当于绕过了 Agent 的决策流程。

## 当前方案

```
KeywordRouter.route(query)
  → 匹配 tags / name / description
  → 返回 ToolCandidate[]（含 score）
  → Executor 将候选转格式 → LLM 做最终选择 → Registry 执行
```

## 后续扩展

- Embedding-based Routing：语义相似度匹配
- LLM-based Routing：让 LLM 参与初步筛选
- Tool Search：延迟加载，按需检索
