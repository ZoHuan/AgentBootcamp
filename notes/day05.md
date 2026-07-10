# Day 5 — Prompt Engineering 深入

## 今天学到的

- Prompt 分层：SYSTEM_PROMPT（身份）→ ROLE_PROMPT（规则）→ TASK_PROMPT（指令）→ FORMAT_PROMPT（输出格式）
- `buildPrompt()` 是 Prompt 组合工厂——以后 RAG、Memory、Tool Calling 都走这里
- Prompt 不是一句话，是「程序」——改变 Prompt 就改变 AI 行为

## 完成内容

- `lib/prompts.ts` 拆分为四层，引入 `buildPrompt({ role, task, context })`
- `FORMAT_PROMPT` 控制 AI 按「概念 → 原理 → 示例 → 错误」四段输出
- 三个角色实验：普通助手 / Google Staff Engineer / 耐心导师，同一问题回答差异显著

## 架构

```
buildPrompt({ role, task, context }) → 拼接 → system message → LLM
```

## 收获

- Prompt Engineering 本质：用自然语言编程，控制 AI 的输出风格、深度和格式
- 分层后每个 Prompt 独立修改，互不影响
