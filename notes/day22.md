# Day 22 — Observability

## 今天学到的

- **为什么 Trace 不是 Log**：Log 是离散事件（"这一步失败了"），Trace 是完整时间线（Planner 200ms → Executor 3000ms → Answer 150ms）。Log 排查单点，Trace 分析整体
- **Span 为什么必须支持 Parent**：Agent 调用链有层次——Tool Span 是 Executor Span 的子级。父子关系还原完整调用树，哪个模块拖慢了整体一目了然
- **Evaluation 和 Tracing 最大区别**：Evaluation 回答"好不好"（score），Tracing 回答"发生了什么"（timeline）。两者独立——一个做质量评估，一个做性能观测

## 完成内容

- `lib/observability/trace.ts` — Trace 类型
- `lib/observability/span.ts` — Span 类型（支持 parentId）
- `lib/observability/tracer.ts` — Tracer（startTrace/endTrace/startSpan/endSpan）
- `lib/observability/event.ts` — TraceEvent
- `lib/observability/timeline.ts` — printTimeline
- `lib/observability/exporter.ts` — exportToJson（预留 OpenTelemetry）
- Runtime 接入：Planner / Executor / Answer 三个 Span

## 架构

```
startTrace → planner Span → executor Span → answer Span → endTrace
                                                ↓
                                           printTimeline
```

## 收获

- Retry 产新 Span（不是新 Trace），审批期间 Trace 继续
- 所有核心模块都应产生 Span，才能追溯到每个环节
