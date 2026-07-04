# Day 3 — Streaming UI + Chat 体验工程化

## 目标

优化 Chat 体验，从"能用"变成"像产品"。

## 审查结果

大部分已在 Day 1 Bonus 完成，本次只补齐缺口：

| 项 | 状态 | 说明 |
|---|---|---|
| 流式逐字输出 | ✅ | 函数式 setState，无闭包 bug |
| user/assistant 气泡 | ✅ | 右深色 / 左浅色 |
| 自动滚动 | ✅ | scrollIntoView |
| loading 状态 | ⚠️→✅ | 新增「AI 正在思考...」呼吸动画 |
| Markdown + 代码高亮 | ✅ | react-markdown |

## 修复

- **hydration 报错**：`useState(loadMessages)` 在 SSR/客户端数据不一致，改为 `useState([])` + `useEffect` 延迟加载 localStorage
