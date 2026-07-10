# Day 16 — Tool Registry & Tool Selection

## 今天学到的

- **为什么 Tool 需要 description**：Agent 选 Tool 靠理解能力描述，不是靠函数名。description 就是给 LLM 看的"菜单"
- **为什么 Runtime 不应该直接 import Tool**：直接 import 导致加工具改多处。通过 Registry 统一管理，Runtime 只依赖接口
- **Tool Registry 的职责**：工具的统一存取层——register/get/getAll/remove。Executor 不关心具体工具，只通过 Registry 操作

## 完成内容

- `lib/tools/tool.ts` — Tool 统一接口（id/name/description/execute）
- `lib/tools/registry.ts` — ToolRegistry（CRUD）
- `lib/tools/selector.ts` — ToolSelector（规则匹配，调 LLM 前预筛选）
- `lib/tools/index.ts` — createToolRegistry 注册入口
- `lib/runtime/executor.ts` — 重构：用 Registry + Selector 替代旧 runner
- 删除 `lib/tools/runner.ts`

## 架构

```
Executor
  ├── Selector → 关键词匹配 → 候选 Tool
  └── Registry → 查找 + 执行
```

## 收获

- Tool 不是函数，是对象（id + name + description + execute）
- Tool Selection 是 Agent 决策的一部分，不属于 Runtime
- Registry 比 import 适合大型项目——控制反转
