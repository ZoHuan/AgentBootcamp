# Day 2 — System Prompt & 结构化消息

## 今天学到的

- system prompt 放在消息列表第一位——LLM 按顺序读，必须先知道"我是谁"
- 每次请求都要重新带 system prompt——LLM 无状态，每次都是新对话
- Prompt Engineering 本质：通过 system message 控制 AI 行为，是"用自然语言编程"

## 完成内容

- `lib/types.ts` — 统一 Message 类型，新增 `"system"` 角色
- `lib/prompts.ts` — System Prompt 单独维护，定义 AI 工程助手身份和 5 条行为规则
- `app/api/chat/route.ts` — 每次请求前注入 system prompt 到消息列表第一位
- `app/page.tsx` — 前端类型统一引用 `@/lib/types`

## 架构

```
route.ts → buildPrompt(SYSTEM_PROMPT) → messages.unshift({ role: "system" }) → LLM
```

## 收获

- 验证：问"你是谁？"→"我是 AI 工程助手"，问技术问题→结构化 + 代码示例
