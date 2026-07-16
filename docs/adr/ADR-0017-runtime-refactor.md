# ADR-0017 Runtime Refactor

## 为什么拆 Runtime？

Day 1-23 的 Runtime 逐渐膨胀到 6 个文件，包含了不属于它的 Planner、Plan 和 Types。Planner 已有独立的 planning 模块，类型散落各处。拆分后 Runtime 只保留 executor、reflector 和 runtime（编排调度）。

## 为什么增加 Core？

所有模块都需要基础类型（Tool、Plan、Evaluation 等），之前各自定义，出现重复和不一致。Core 集中管理领域模型，各模块从 core 导入，避免类型冲突。

## 为什么增加 Policy？

Guardrails 的规则写死在代码里。Policy Engine 把规则配置化——改规则只改 policy 文件，不改 Guardrail 代码。以后支持动态加载、数据库存储。

## 当前方案

```
lib/core/         ← 基础类型 + 错误 + 上下文
lib/services/llm/ ← LLM 抽象
lib/runtime/      ← 编排调度（3 文件）
lib/policy/       ← 策略引擎
```

所有模块通过 index.ts 统一导出。

## 后续扩展

- Core types 逐步替代各模块本地类型
- Policy Engine 接入 Guardrails 和 Approval
- LLM Service 接入 Executor
