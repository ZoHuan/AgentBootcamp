# Day 1 — LLM + AI 应用入门

## 目标

做一个最小可用 AI Chat 应用（Mini ChatGPT）。

## 完成内容

- Next.js (App Router) + TypeScript + Tailwind 项目搭建
- API Route：`app/api/chat/route.ts`，OpenAI SDK 调用 MiMo 流式 API，`ReadableStream` 逐块返回
- Chat UI：`app/page.tsx`，输入框 + 发送、消息列表、流式逐字渲染
- Bonus：`react-markdown` 代码高亮 + `localStorage` 持久化

## 架构

```
User Input → Frontend (Next.js) → API Route → LLM (MiMo) → Stream → UI 渲染
```

## 技术收获

- OpenAI SDK 的 `stream: true` + `ReadableStream` 实现流式输出
- SSE 在 Next.js API Route 中的处理
- `useState` + `useEffect` 管理聊天状态和自动滚动
- `localStorage` 持久化聊天记录

## 遇到的问题

- OpenAI API 国内无法直连 → 换成小米 MiMo（OpenAI 兼容接口）
- Gemini 镜像不稳定 → 放弃
- `.env.local` 修改后需重启 dev server 才能生效
