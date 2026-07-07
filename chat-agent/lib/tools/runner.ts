import { registerTool, getAllDefinitions, getTool } from "./registry";
import { getWeather } from "./getWeather";

registerTool(
  {
    type: "function",
    function: {
      name: "get_weather",
      description: "获取指定城市的天气信息",
      parameters: {
        type: "object",
        properties: {
          city: { type: "string", description: "城市名称" },
        },
        required: ["city"],
      },
    },
  },
  (args) => JSON.stringify(getWeather(args as { city: string }))
);

export function getToolDefinitions() {
  return getAllDefinitions();
}

export function executeTool(name: string, args: Record<string, unknown>): string | null {
  const tool = getTool(name);
  if (!tool) return null;
  return tool.execute(args);
}
