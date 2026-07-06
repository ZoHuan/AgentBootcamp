# Day 6 — Structured Output（结构化输出）

## 为什么 Agent 不喜欢自然语言？

自然语言是给人读的，JSON 是给程序读的。Agent 需要的是后者——以后 Tool Calling、Function Calling 全部建立在结构化数据之上。

## 完成内容

### Schema 定义
- `lib/schemas/answer.ts` — `Answer { title, summary, examples[] }` 接口

### 结构化 Prompt
- `STRUCTURED_OUTPUT_PROMPT` 要求 AI 纯 JSON 输出，不要 markdown 包裹

### 解析层
- `lib/parser/parseResponse.ts` — 三层防御：
  1. 洗数据：去掉 ` ```json``` ` 包裹
  2. `JSON.parse()` 解析
  3. 字段校验（title? summary? examples[]?）

### 异常处理
- 全部包在 `try/catch`，失败返回 `null`，程序不崩

### Bonus：Answer Card
- `MessageItem` 检测 JSON 回答 → 渲染为结构化卡片（标题 + 概要 + 示例列表）
- 非 JSON 回答走 Markdown 渲染

## 核心理解

**为什么不能信任 LLM 一定返回正确格式？**
- AI 可能返回 markdown 包裹的 JSON
- AI 可能字段名写错（description vs summary）
- AI 可能返回纯文本而不是 JSON
- JSON 可能被截断

**为什么需要 Schema？**
- 定义"什么是有效数据"——程序只消费符合 Schema 的数据
- 校验不仅检查 JSON 合法，还检查字段名和类型

**为什么需要解析层？**
- 不能把 `JSON.parse()` 散落在业务代码里
- 集中处理清洗、解析、校验逻辑
- 以后 Tool Calling、Agent 全都复用
