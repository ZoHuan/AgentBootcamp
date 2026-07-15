# ADR-0015 Observability

## 为什么需要 Observability？

Runtime 已包含 Planning、Executor、Reflector 等多个模块，每次运行涉及 LLM 调用、工具执行、重试等环节。需要统一的可观测体系追踪全过程，而非散落的 `console.log`。

## 为什么 Tracing 不是 Log？

Log 是离散事件，Trace 是完整时间线——从 Planner 到 Answer 每个 Span 的耗时、状态、父子关系一目了然。Log 排查单点问题，Trace 分析整体性能和调用链。

## 当前方案

```
Tracer { startTrace, endTrace, startSpan, endSpan }
Trace { id, workflowName, spans[] }
Span { id, name, parentId?, startedAt, endedAt?, status }
```

Runtime 在 Planner、Executor、Answer 三个阶段创建 Span。

## 后续扩展

- OpenTelemetry Export：导出到标准链路追踪系统
- Dashboard：可视化 Trace 时间线
- Cost Analytics：结合 Token 用量做成本分析
