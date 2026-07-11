export interface EvalCase {
  id: string;
  input: string;
  expectedGoal?: string;
  expectedTools?: string[];
}

export const evalDataset: EvalCase[] = [
  {
    id: "weather-01",
    input: "北京天气怎么样？",
    expectedGoal: "天气",
    expectedTools: ["get_weather"],
  },
  {
    id: "chat-01",
    input: "你好，你是谁？",
    expectedGoal: "对话",
  },
  {
    id: "unknown-01",
    input: "帮我写一段代码",
    expectedGoal: "通用",
    expectedTools: [],
  },
  {
    id: "weather-02",
    input: "东京今天会下雨吗？",
    expectedGoal: "天气",
    expectedTools: ["get_weather"],
  },
  {
    id: "chat-02",
    input: "解释一下闭包",
    expectedGoal: "解释",
  },
];
