# Day 9 — Memory（记忆）

## 核心概念

Memory 保存的不是消息，而是上下文（Context）。

三层记忆：
- Working Memory（短期）← 今天实现
- Session Memory（会话）
- Long-term Memory（长期）

## 完成内容

### MemoryManager（lib/memory/memory.ts）
- `save(role, content)` — 存入一条记忆
- `load()` — 读取全部
- `clear()` — 清空
- `formatHistory()` — 格式化为 Prompt 可用的文本
- 长度限制：默认 10 条，`slice(-maxEntries)` 自动裁尾

### AgentRuntime 接入
- Runtime 持有 MemoryManager 实例
- 每次 `run()` 前从 Memory 取历史注入 system prompt
- 用户消息和 AI 回复自动存入 Memory
- `respond()` 内用闭包变量 `const memory = this.memory` 解决 `this` 丢失问题

## 架构

```
用户 → Runtime → Memory.formatHistory() → system prompt → LLM
                    ↑ save(user)                    save(assistant) ↑
```

Memory 属于 Agent，不属于 API。route.ts 完全不知道 Memory 的存在。
