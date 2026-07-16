# Architecture Overview

## Agent Runtime v0.2.0

```
User → Guard → Runtime → Planner → Workflow → Executor → Tool
                  │          │           │          │
                  ▼          ▼           ▼          ▼
               Trace    Policy       Approval    Recovery
                  │                      │
                  ▼                      ▼
            Observation            Evaluation
```

## 分层架构

```
core            ← 基础类型 + 错误 + 上下文
  ↑
runtime         ← 编排调度（AgentRuntime）
  ↑
workflow        ← 流程引擎
  ↑
tools           ← 工具体系
```

## 核心模块

### Core（lib/core/）
- `types/agent.ts` — AgentState + ExecutionContext
- `types/tool.ts` — Tool + ToolResult
- `types/workflow.ts` — Plan / PlanStep / WorkflowState / nextStep
- `types/execution.ts` — Evaluation + Metrics
- `errors/errors.ts` — AgentError / ToolError / PlannerError
- `context.ts` — createContext 工厂

### Runtime（lib/runtime/）
编排调度中心：Guard → Trace → Plan → Execute → Reflect → Retry → Output Guard → Answer

### Planning（lib/planning/）
LLM Planner：Prompt → LLM → JSON → validate → Plan

### Workflow（lib/workflow/）
WorkflowEngine：节点路由 + 条件分支 + 审批暂停

### Tools（lib/tools/）
Tool Registry + KeywordRouter + 评分路由

### Evaluation（lib/evaluation/）
evaluate / evaluateAll + Metrics + Report

### Recovery（lib/recovery/）
RetryManager（指数退避）+ ErrorHandler（错误分类）

### Approval（lib/approval/）
ApprovalManager：requestApproval / approve / reject + RiskLevel

### Guardrails（lib/guardrails/）
InputGuard / ToolGuard / OutputGuard + GuardrailManager

### Observability（lib/observability/）
Tracer + Trace + Span + Timeline + Exporter

### Policy（lib/policy/）
PolicyEngine + RiskPolicy

### Services（lib/services/llm/）
LLMClient 抽象（chat / stream），预留 OpenAI/Claude/Gemini 适配

## 设计思想

- 职责分离：每模块只做一件事
- 依赖单向：core ← runtime ← workflow ← tools
- 可观测：Trace + Span 覆盖全流程
- 可恢复：Checkpoint + Retry 双重保障
- 可扩展：加 Tool 不改 Runtime，加 Policy 不改 Guard
