# Day 11 — Reflection（反思）

## 今天学到的

Agent 不应一次回答就结束。真正的 Agent 会检查自己的结果——Plan → Execute → Reflect → Retry if needed。

- Planner：事前规划（怎么做？）
- Reflector：事后评估（做得怎么样？）

## 完成内容

- `lib/agent/reflector.ts` — Reflector 类，`evaluate()` 返回 Evaluation
- Evaluation 类型：`success / confidence / reason / retry`
- Runtime 加入 Reflect 步骤：回答后立即评估
- Retry 循环：评估不通过自动重试，最多 2 次
- 错误检测：扫描 `error/failed/500/timeout` 关键词触发重试
- Reflection Logger：控制台打印评估结果

## 架构

```
Runtime 循环:
  while (true) {
    Plan → Execute → Reflect
    如果 retry=true 且 < 2 次 → 回到 Execute
    否则 → 返回答案
  }
```

## 收获

- ReadableStream 是一次性的——先自己读完评估，满意再重新创建流发给用户
- 职责分离的价值：Reflector 独立后，未来换 LLM 驱动的评估器，Runtime 和 Executor 都不动
