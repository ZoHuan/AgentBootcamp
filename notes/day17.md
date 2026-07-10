# Day 17 — Tool Router

## 今天学到的

- **Tool Router vs Registry**：Registry 是仓库（存取 Tool），Router 是筛选器（决定给 LLM 看哪些）
- **为什么 Router 不应该直接执行 Tool**：Router 的职责是缩小候选范围，最终决策仍由 LLM 做——这不是绕过 Agent，是优化
- **为什么 Candidate Tool（多个）比返回唯一 Tool 更合理**：单一 Tool 剥夺了 LLM 的决策权。Router 提候选，LLM 做最终选择——各司其职

## 完成内容

- `lib/tools/router.ts` — ToolRouter 接口 + KeywordRouter 实现
- `lib/tools/tool.ts` — Tool 元数据升级（tags / category / priority）
- ToolCandidate（tool + score）评分机制
- Executor 改用 Router 替代 Selector：候选列表 → LLM → 执行

## 架构

```
User → Router → [候选 Tool] → LLM → 最终选择 → Registry → 执行
```

## 收获

- Tool 越多，Router 价值越大——500 个 Tool 时 Runtime 不需要改动
- 三层职责清晰：Registry（存取）→ Router（筛选）→ LLM（决策）
