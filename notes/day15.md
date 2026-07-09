# Day 15 — Sprint Review + v0.1.0 Release

## 今天学到的

- 项目从 Demo 升级为工程项目的关键：README、CHANGELOG、LICENSE、架构文档、ADR 索引
- 项目摊平：去掉 `chat-agent/` 外壳，AgentBootcamp 自身就是 Next.js 项目
- `lib/agent/` → `lib/runtime/` 更准确表达模块职责
- Git Tag 管理版本：v0.1.0 是第一个里程碑

## 完成内容

- 项目结构重组：摊平为单项目
- 模块改名：`lib/runtime/`
- 文档补齐：README / CHANGELOG / LICENSE / 架构文档 / ADR 索引
- `.gitignore` 完善
- `package.json` 改名 `agent-bootcamp`
- 发布 v0.1.0

## 架构

当前项目具备完整 Agent Runtime：
Planner + Workflow + Executor + Reflector + Memory + StateMachine + Checkpoint

## 收获

- 工程化不只是写代码——文档、版本、协议同样重要
- 一个完整开源项目的骨架：README + CHANGELOG + LICENSE + ADR + Architecture
