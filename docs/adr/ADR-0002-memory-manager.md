# ADR-0002 Memory Manager

## 为什么 Memory 独立？

Day 8 以前对话历史由前端 `messages` 数组管理，前后端各存一份，职责混乱。Day 9 引入 MemoryManager 后，上下文管理统一归 Agent 内部。

## 为什么不放 Route？

Memory 是 Agent 的内部状态，Route 不应感知。以后换存储后端（Redis、向量数据库）时，Route 不需要任何改动。

## 当前方案

```
MemoryManager (lib/memory/memory.ts)
├── save(role, content)    → 存入一条
├── load()                 → 读取全部
├── clear()                → 清空
├── formatHistory()        → 格式化为 Prompt 上下文
└── maxEntries = 10         → 长度限制
```

## 后续扩展

- 替换为 Redis / 向量数据库
- 分层记忆：Working / Session / Long-term
- 自动摘要压缩长对话
