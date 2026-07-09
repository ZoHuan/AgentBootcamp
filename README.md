# AgentBootcamp

100 天 AI Agent 工程训练项目——从零构建生产级 Agent Runtime。

## Architecture

```
User → Runtime → Planner → Workflow → Executor → Reflector
                  │           │
                  ▼           ▼
               Memory     StateMachine
                              │
                          Checkpoint
```

## Features

- ✅ Chat + Streaming
- ✅ Prompt Management（分层架构）
- ✅ Structured Output
- ✅ Tool Calling（注册中心 + 执行器）
- ✅ Agent Runtime（Planner → Executor → Reflector）
- ✅ Memory（上下文管理）
- ✅ Multi-Step Planning
- ✅ Reflection + Auto-Retry
- ✅ Workflow Engine（节点路由 + 条件分支）
- ✅ State Machine（生命周期管理）
- ✅ Checkpoint（崩溃恢复）

## Quick Start

```bash
echo "MIMO_API_KEY=你的key" > .env.local
npm install
npm run dev
```

打开 http://localhost:3000

## Project Structure

```
AgentBootcamp/
├── app/              # Next.js App Router
├── components/       # UI 组件
├── lib/
│   ├── runtime/      # Agent Runtime
│   ├── workflow/     # Workflow Engine
│   ├── state/        # State Machine + Checkpoint
│   ├── memory/       # Memory Manager
│   ├── tools/        # Tool Registry + Runner
│   └── prompts/      # Prompt 分层管理
├── docs/
│   ├── adr/          # 架构决策记录
│   └── architecture/  # 架构文档
├── notes/            # 每日学习笔记
└── CHANGELOG.md
```

## Roadmap

| Version | Content |
|---------|---------|
| v0.1.0  | Agent Runtime Foundation |
| v0.2.0  | Observability |
| v0.3.0  | Evaluation |
| v0.4.0  | RAG |
| v0.5.0  | MCP |
| v0.6.0  | Multi-Agent |
| v1.0.0  | Production Release |

## Current Progress

| Days | 内容 |
|------|------|
| Day 1-5 | Chat + Prompt + Structured Output |
| Day 6-8 | Tool Calling + Agent Runtime |
| Day 9-11 | Memory + Planning + Reflection |
| Day 12-14 | Workflow + State Machine + Checkpoint |
| Day 15 | Sprint Review + v0.1.0 Release |

## License

MIT
