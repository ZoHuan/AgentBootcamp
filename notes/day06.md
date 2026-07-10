# Day 6 — Structured Output（结构化输出）

## 今天学到的

- 自然语言给人读，JSON 给程序读——Agent 需要结构化数据，不是自由文本
- 不能信任 LLM 一定返回正确格式：可能包 markdown、字段名写错、文本截断
- Schema 定义"什么是有效数据"，解析层集中处理清洗 → 解析 → 校验

## 完成内容

- `lib/schemas/answer.ts` — Answer `{ title, summary, examples }` 接口
- `STRUCTURED_OUTPUT_PROMPT` — 要求 AI 纯 JSON 输出
- `lib/parser/parseResponse.ts` — 三层防御（去包裹 → JSON.parse → 字段校验）
- try/catch 兜底，解析失败返回 null 不崩溃
- Bonus：MessageItem 检测 JSON → Answer Card 渲染

## 架构

```
AI 返回 JSON 字符串 → parseResponse() → Answer | null → UI Card / Markdown
```

## 收获

- 以后 Tool Calling、Agent 都建立在结构化输出之上
- 解析层集中管理清洗逻辑，不散落在业务代码里
