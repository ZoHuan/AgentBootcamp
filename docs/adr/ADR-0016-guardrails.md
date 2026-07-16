# ADR-0016 Guardrails

## 为什么需要 Guardrails？

Agent 已具备 Tool、Planning、Approval 等能力，需要建立统一的安全控制机制。Guardrails 在输入、工具调用、输出三个阶段拦截危险行为。

## 为什么 Guardrails 是 Runtime 的能力而不是 LLM 的能力？

LLM 的输出不可靠——无法保证每次都能自觉过滤危险内容。Guardrails 是代码层硬约束，不依赖 LLM 的判断。LLM 负责"生成"，Guardrails 负责"把关"。

## 当前方案

```
InputGuardrail:  空/超长/黑名单
ToolGuardrail:   未知工具/高风险
OutputGuardrail: 空/超长/敏感词
GuardrailManager: 依次执行 guard 链
```

Input Guard 在 Planner 前运行（拦截无效请求），Tool Guard 在 Executor 中运行（拦截危险工具），Output Guard 在返回前运行（过滤敏感内容）。

## 后续扩展

- LLM-based Guardrails：让 LLM 参与安全判断
- Policy Engine：动态配置规则
- Dynamic Risk Assessment：实时评估请求风险等级
