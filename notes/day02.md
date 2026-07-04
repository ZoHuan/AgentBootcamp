# Day 2 — System Prompt & 结构化消息

## 目标

让 AI 有身份和角色，不再是随便聊天。

## 完成内容

- `lib/types.ts` — 统一 Message 类型，新增 `"system"` 角色
- `lib/prompts.ts` — System Prompt 单独维护，定义 AI 工程助手身份和 5 条行为规则
- `app/api/chat/route.ts` — 每次请求前注入 system prompt 到消息列表第一位
- `app/page.tsx` — 前端类型统一引用 `@/lib/types`

## 核心理解

- **system prompt 为什么放第一个**：LLM 按消息顺序生成，必须先读到"我是谁"再看到用户问题
- **每次请求都要带 system prompt**：LLM 无状态，每次都是新对话
- **Prompt Engineering 本质**：通过 system message 控制 AI 行为，是"用自然语言编程"

## 验证结果

- 问"你是谁？" → 回答"我是 AI 工程助手"
- 问技术问题 → 结构化 + 代码示例
