# Day 3 — Streaming UI + Chat 体验工程化

## 今天学到的

- AI 应用的体验工程——流式渲染、气泡 UI、自动滚动、loading 状态
- React 19 hydration 问题：`useState(loadMessages)` 在 SSR/客户端不一致

## 完成内容

- 审查流式渲染逻辑：函数式 setState 避免闭包 bug
- user/assistant 气泡：右深色 / 左浅色
- 自动滚动：`scrollIntoView`
- loading 状态：新增「AI 正在思考...」呼吸动画
- Markdown + 代码高亮

## 架构

```
Chat UI → MessageList → MessageItem → react-markdown + highlight.js
```

## 收获

- hydration 修复：`useState([])` + `useEffect` 延迟加载 localStorage
- 大部分体验优化已在 Day 1 Bonus 完成
