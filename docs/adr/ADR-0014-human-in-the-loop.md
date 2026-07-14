# ADR-0014 Human-in-the-Loop

## 为什么需要 Human-in-the-Loop？

Agent 将逐步具备执行高风险操作的能力（删除仓库、发送批量邮件、Git Push）。这些操作不能自动执行，需要人工审批降低业务风险、满足合规要求。

## 为什么 Approval 属于 Workflow，而不是 Planner？

Planner 负责"做什么"（生成步骤），Workflow 负责"怎么执行"（控制流程）。Approval 是流程控制节点——暂停、等待、继续——这是 Workflow 的职责，不是 Planner 的。

## 当前方案

```
WorkflowNode { needsApproval, riskLevel }
WorkflowEngine → 审批检查
  → needsApproval 且 risk≠LOW → requestApproval → saveCheckpoint → 暂停
  → 批准后 → loadCheckpoint → 继续执行
```

低风险（LOW）自动通过，中高风险（MEDIUM/HIGH）需审批。

## 后续扩展

- Multi-level Approval：多级审批链
- Approval Timeout：超时自动拒绝
- Policy Engine：基于风险等级的审批策略
