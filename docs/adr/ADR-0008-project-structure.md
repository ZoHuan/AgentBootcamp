# ADR-0008 项目结构重组

## 为什么摊平项目？

Day 1-14 的 `chat-agent/` 子目录是项目初创期遗留——当时以为会有多个子项目。进入持续迭代阶段后，单项目 + Git Tag 管理版本是更好的方式。

## 为什么不保留子目录？

项目已明确为单一 Agent Runtime 持续演进，不会新增独立子项目。壳目录 `chat-agent/` 增加了路径层级，降低开发效率。

## 当前方案

- 删除 `chat-agent/`，AgentBootcamp 自身即为 Next.js 项目
- `lib/agent/` → `lib/runtime/`，更准确表达模块职责
- 版本管理改为 Git Tag（`v0.1.0`, `v0.2.0` ...）

## 后续扩展

- 如需多项目，使用 Git Submodule 或 Monorepo（Turborepo）
