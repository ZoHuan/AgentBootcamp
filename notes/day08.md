# Day 8 — Agent Runtime：ReAct（Reason + Act）

## 今天学到的

- **ReAct** = Reason + Act：Agent 先思考"需要调什么工具"，再执行，最后总结
- **为什么 Agent 要 Thought**：LLM 需要停下来决策——直接编答案还是调工具？`plan()` 就是决策点
- **Runtime vs Tool Runner**：Runtime 编排流程（依赖 LLM），Runner 管理工具（不依赖 LLM）

## 完成内容

- `lib/agent/runtime.ts` — AgentRuntime（plan → execute → respond）
- `lib/tools/registry.ts` — 工具注册中心
- `lib/tools/runner.ts` — 工具执行器
- route.ts 瘦身到 15 行，全委托给 AgentRuntime

## 架构

```
route.ts → AgentRuntime
            ├── plan()     → 调 LLM + tools
            ├── execute()  → 执行工具
            └── respond()  → 流式返回
```

## 收获

- 职责分离：Runtime 做调度，不再直接调 LLM
- AGent 核心公式落地：`Agent = LLM + Tools + Loop`
