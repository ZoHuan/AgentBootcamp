# Day 1 — Mini ChatGPT

最小可用 AI Chat 应用。

## 架构

```
User Input → Frontend (Next.js) → API Route → LLM (MiMo) → Stream → UI 渲染
```

## 技术栈

- Next.js (App Router) + TypeScript + Tailwind
- OpenAI SDK（兼容 MiMo API）

## 运行

```bash
# 配置 API Key
echo "MIMO_API_KEY=你的key" > .env.local

# 启动
npm run dev
```

打开 http://localhost:3000

## 核心代码

**API Route** — `app/api/chat/route.ts`

OpenAI SDK 调流式 API，用 `ReadableStream` 逐块返回。

**Chat UI** — `app/page.tsx`

- 输入框 + 发送（Enter / 按钮）
- 消息列表（用户右对齐，AI 左对齐）
- 流式逐字渲染
- Markdown 渲染 + 代码高亮（`react-markdown`）
- localStorage 持久化（刷新不丢失）

## 验收标准

- ✅ 输入一句话，AI 返回回答
- ✅ 流式逐字输出
- ✅ Markdown 渲染（代码块、表格等）
- ✅ 聊天记录持久化
