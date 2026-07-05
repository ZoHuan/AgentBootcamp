# Day 5 — Prompt Engineering 深入

## 今天学到的

### 1. Prompt 分层架构

```
SYSTEM_PROMPT  → 你是谁（身份）
ROLE_PROMPT    → 你遵守什么规则（行为规范）
TASK_PROMPT    → 当前要做什么（任务指令）
FORMAT_PROMPT  → 输出格式控制（结构化模版）
```

### 2. buildPrompt() — Prompt 组合工厂

```ts
buildPrompt({ role, task, context })
```

职责：把多个 prompt 片段拼成一条 system message。以后 RAG、Memory、Tool Calling 都走这里。

### 3. 输出格式控制

通过 `FORMAT_PROMPT` 告诉 AI 按「概念 → 原理 → 示例 → 常见错误」四段输出，实现了用自然语言控制输出结构。

## Prompt 实验

同一个问题「什么是闭包？」，三个不同角色设定：

| 实验 | 角色 | 结果 |
|---|---|---|
| R_A | 普通助手 | 回答全面、平衡 |
| R_B | Google Staff Engineer | 更专业、深入底层原理 |
| R_C | 耐心导师 | 通俗易懂、教学比喻 |

## 我的理解

Prompt 不是一句话，是「程序」。改变 Prompt 就改变了 AI 的行为模式，就像改变函数参数改变程序行为一样。

Prompt Engineering 的本质：**用自然语言编程，控制 AI 的输出风格、深度和格式。**
