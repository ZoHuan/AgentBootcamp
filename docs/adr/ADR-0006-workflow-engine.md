# ADR-0006 Workflow Engine

## 为什么需要 Workflow Engine？

线性 Planning（所有 step 顺序执行）无法处理条件分支和动态路由。Workflow Engine 引入 Node + State + 条件跳转，让流程可以根据执行结果决定下一步走向。

## 为什么不完全依赖 LLM 决定流程？

LLM 输出不可靠——可能走错分支、跳过关键步骤、进入死循环。生产环境需要可预测、可调试、可恢复的执行流程，这些建立在确定性 Engine 之上。

## 为什么 WorkflowState 需要独立？

State 是节点间共享的上下文——`data` 在 `execute` 之间传递结果，`currentStep` 追踪进度，`status` 判断整体状态。独立后，Memory、Reflection、Human Approval 都可以读取同一个 State。

## 当前方案

```
WorkflowEngine
├── nodeMap: Map<id, WorkflowNode>  // 节点映射表
├── state: WorkflowState            // 全局共享状态
└── start()
      while (currentNode) {
        ① execute(state) → 调 LLM
        ② merge result → state.data
        ③ next(state) → 下一个节点 id / null 结束
      }
```

## 后续扩展

- 支持 DAG（多分支并行 + 汇聚）
- 支持 Human-in-the-loop（节点执行前等待审批）
- AgentRuntime 集成（Engine 作为 Runtime 的执行引擎）
