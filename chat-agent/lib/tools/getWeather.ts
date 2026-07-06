export const WEATHER_TOOL = {
  type: "function" as const,
  function: {
    name: "get_weather",
    description: "获取指定城市的天气信息",
    parameters: {
      type: "object" as const,
      properties: {
        city: {
          type: "string",
          description: "城市名称，例如 北京、东京",
        },
      },
      required: ["city"],
    },
  },
};

export function getWeather(args: { city: string }) {
  return {
    city: args.city,
    temp: 28,
    condition: "晴天",
    humidity: "45%",
  };
}

export function executeTool(name: string, args: Record<string, unknown>) {
  if (name === "get_weather") {
    return JSON.stringify(getWeather(args as { city: string }));
  }
  return JSON.stringify({ error: `未知工具: ${name}` });
}
