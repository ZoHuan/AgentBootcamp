# Day 7 — Tool Calling

## 今天学到的

- Tool Calling 让 LLM 从"回答问题"变成"决定执行动作"
- Agent 核心公式：`Agent = LLM + Tools + Loop`
- 两轮调用：第一轮 LLM 决定用哪个函数 → 代码执行 → 结果塞回对话 → 第二轮 LLM 总结

## 完成内容

- `lib/tools/getWeather.ts` — 天气 tool schema + mock 函数
- `app/api/chat/route.ts` 改造：非流式第一轮（带 tools 参数）→ 执行函数 → 流式第二轮
- OpenAI 的 `{ role, content }` + `tool_calls` 格式是事实标准

## 架构

```
User → LLM（第一轮）→ tool_calls → executeTool() → LLM（第二轮流式）→ Answer
```

## 收获

- 国内模型（MiMo、DeepSeek、Qwen 等）全部兼容 OpenAI tool calling 格式
- tool_calls 不是文字回答，是结构化的函数调用请求
