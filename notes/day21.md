# Day 21 — Human-in-the-Loop

## 今天学到的

- **Retry 和 Approval 的区别**：Retry 解决技术问题（网络超时，自动恢复），Approval 解决业务风险（删除仓库，人工确认）
- **为什么 Approval 属于 Workflow 而不是 Planner**：Approval 是流程控制——暂停、等待、继续——这是 Workflow 的职责。Planner 只管生成计划，不该控制执行节奏
- **哪些 Tool 应该默认要求人工审批**：有副作用且不可逆的操作——Git Push、发送邮件、支付、删除资源——这些需要 HUMAN 确认，LOW 风险（如搜索、计算）可自动通过

## 完成内容

- `lib/approval/approval.ts` — ApprovalRequest + RiskLevel
- `lib/approval/approval-store.ts` — ApprovalStore（存储）
- `lib/approval/approval-manager.ts` — ApprovalManager（request/approve/reject/needsApproval）
- WorkflowNode 新增 needsApproval + riskLevel
- WorkflowEngine 加审批检查 + Checkpoint 联动

## 架构

```
Workflow → 审批检查
  → LOW → 自动执行
  → MEDIUM/HIGH → requestApproval → saveCheckpoint → 暂停
  → approve → loadCheckpoint → 继续
  → reject → 停止
```

## 收获

- 审批请求应有过期时间（TTL），避免无限等待
- 审批通过后 Tool 执行失败 → 走 Retry，不需要重新审批
- 审批动作需记录审计日志（Audit Log）
