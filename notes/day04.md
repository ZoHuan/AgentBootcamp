# Day 4 — Chat UX + 工程结构重构

## 目标

把 Chat 从"能用"升级成"像产品一样顺滑"。

## 完成内容

### Message 数据结构升级
- `id: string` 用 `crypto.randomUUID()` 替代 index 做 key
- `status?: "streaming" | "done"` 追踪流式状态

### UI 组件拆分
```
components/chat/
├── chat.tsx           # 状态管理 + API 调用
├── message-list.tsx   # 消息列表 + 自动滚动
├── message-item.tsx   # 单条气泡（Markdown / 纯文本）
└── chat-input.tsx     # 输入框（Enter 发送 / Shift+Enter 换行）
```

### 自动滚动
- `useRef` 锚点 + `scrollIntoView({ behavior: "smooth" })`
- 流式输出时 messages 每次更新都触发滚动

### 输入框优化
- `textarea` 替代 `input`，原生支持多行
- `handleKeyDown` 拦截纯 Enter 触发发送

### Streaming 稳定性
- 创建消息时标记 `status: "streaming"`
- 更新时检查 `last.status === "streaming"` 防止误操作
- 流结束时改 `status: "done"`

### React 19 适配
- 使用 `startTransition` 包裹 localStorage 初始化，避免同步 setState 警告
