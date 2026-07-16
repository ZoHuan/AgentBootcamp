# Day 24 — Sprint 2 Review + v0.2.0 Release

## 今天学到的

- Sprint Review 不是加功能，是停下来整理
- 依赖方向单向：core ← runtime ← workflow ← tools
- 项目工程化：index.ts 统一入口、core 集中类型、policy 预留策略

## 完成内容

- 删除遗留文件：runtime/planner.ts, plan.ts, types.ts
- lib/core/ 创建（types/errors/context）
- 11 个模块 index.ts
- lib/services/llm/ LLM 抽象
- lib/policy/ 策略引擎
- Runtime 加编排注释
- 文档更新：README/CHANGELOG/ADR-0017

## 架构

```
core → runtime → workflow → tools
         ↑
    services/llm, policy
```

## 收获

- 每 Sprint 做一次 Review，清理遗留
- 统一入口让外部调用更清晰
- 类型集中管理避免冲突
