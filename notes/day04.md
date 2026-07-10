# Day 4 — Chat UX + 工程结构重构

## 今天学到的

- UI 组件拆分：Chat（状态管理）+ MessageList + MessageItem + ChatInput
- Message 数据结构升级：`id: string` + `status: "streaming" | "done"` 
- React 19 适配：`startTransition` 包裹 localStorage 初始化

## 完成内容

- `components/chat/` 四组件拆分
- Message 加 id（crypto.randomUUID）替代 index 做 key
- status 追踪流式状态——避免消息被误覆盖
- `textarea` 替代 `input`，Enter 发送 / Shift+Enter 换行
- 自动滚动 + loading 状态

## 架构

```
page.tsx → Chat
           ├── MessageList → MessageItem（气泡 + Markdown）
           └── ChatInput（Enter / Shift+Enter）
```

## 收获

- 用 status 明确区分"正在流式输出中"和"已完成"
- 闭包问题用函数式 setState 解决
- startTransition 让 React 19 不报警
