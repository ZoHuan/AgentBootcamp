# Day 7 — Tool Calling

## 本质

让 LLM 从"回答问题"变成"决定执行动作"。

## Tool Calling 循环

```
User → LLM（决定是否调工具）
         ↓ 是
    返回 tool_calls（不是文字回答）
         ↓
    你的代码执行函数
         ↓
    结果塞回对话
         ↓
    LLM 再总结给用户
```

## 实现

### 工具定义
`lib/tools/getWeather.ts` — OpenAI 格式的 tool schema + mock 函数 + 执行器

### 路由改造
`app/api/chat/route.ts`:
1. 第一轮（非流式）：带 `tools` 参数问 LLM
2. 如果 LLM 返回 `tool_calls`：执行函数，结果以 `role: "tool"` 塞回对话
3. 第二轮（流式）：让 LLM 基于工具结果生成自然语言回答

## Agent 核心公式

```
Agent = LLM + Tools + Loop
```

今天跑通了最小循环。

## 行业现状

- OpenAI 的 `{ role, content }` + `tool_calls` 格式是事实标准
- 国内模型（DeepSeek、Qwen、Moonshot、MiMo）全部兼容
- 国外模型各有原生格式（Gemini、Anthropic），但 OpenAI 兼容是主流
