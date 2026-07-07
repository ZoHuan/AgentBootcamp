# Day 8 — Agent 核心：ReAct（Reason + Act）

## 核心概念

### 什么是 ReAct？
**Re**ason + **Act** = 先思考再行动。Agent 不直接回答问题，而是先判断"需要调什么工具"，执行后再总结。

### 为什么 Agent 要「Thought」？
因为 LLM 需要停下来「决策」——用户问天气，是直接编一个答案？还是调 get_weather 工具？`plan()` 这一步就是给 LLM 决策的机会。

### Runtime vs Tool Runner？
| | AgentRuntime | Tool Runner |
|---|---|---|
| 职责 | 编排流程 | 管理工具 |
| 方法 | plan / execute / respond | getDefinitions / executeTool |
| 依赖 LLM？ | 是 | 否 |

## 完成内容

### AgentRuntime（lib/agent/runtime.ts）
- `plan()` — 调 LLM + tools，获取 tool_calls
- `execute()` — 根据 tool_calls 执行函数
- `respond()` — 流式返回最终答案

### 工具体系重构
- `lib/tools/registry.ts` — 工具注册中心
- `lib/tools/runner.ts` — 工具执行器（走注册中心）
- `lib/tools/getWeather.ts` — 纯函数

### 目录结构成型
```
lib/
├── agent/runtime.ts
├── tools/{registry,runner,getWeather}.ts
├── prompts/index.ts
├── parser/
└── schemas/
```
