# ADR-0009 Tool Registry

## 为什么需要 Tool Registry？

Tool 数量增长时，每个新工具都要在定义字典和执行字典各写一次。Registry 统一抽象 Tool 的存取，Executor 不再依赖具体工具实现。

## 为什么不直接 import Tool？

直接 import 导致加工具改多处（runner.ts + executor.ts）。通过 Registry，加工具只一处 `registry.register()`，Runtime 和 Executor 只依赖接口。

## 当前方案

```
Tool { id, name, description, execute }
ToolRegistry { register, get, getAll, remove }
ToolSelector { select(userInput) → Tool | null }
```

Executor 通过 Selector 预筛选 → Registry 查找 → 执行。

## 后续扩展

- MCP Tool：外部工具协议接入
- Remote Tool：远程 API 动态加载
- LLM-driven Selector：替换规则版关键词匹配
