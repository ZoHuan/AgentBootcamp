# Day 9 — Memory（记忆）

## 今天学到的

- Memory 保存的不是消息，而是上下文（Context）
- 三层记忆：Working（短期）→ Session（会话）→ Long-term（长期），今天实现第一层
- Memory 属于 Agent，不属于 API——route.ts 完全不知道 Memory 的存在

## 完成内容

- `lib/memory/memory.ts` — MemoryManager（save/load/clear/formatHistory）
- 长度限制：默认 10 条，`slice(-maxEntries)` 自动裁尾
- AgentRuntime 接入：每次 run() 前注入历史到 system prompt，回复后自动保存
- `this` 丢失问题：闭包变量 `const memory = this.memory` 解决

## 架构

```
用户 → Runtime → Memory.formatHistory() → system prompt → LLM
                    ↑ save(user)              save(assistant) ↑
```

## 收获

- Memory 和前端 messages 分离：Memory 给 LLM 上下文，前端管 UI 展示
- 以后升级方向：向量检索、自动摘要压缩
