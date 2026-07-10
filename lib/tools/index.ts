import { ToolRegistry } from "./registry";
import { getWeather } from "./getWeather";

export function createToolRegistry(): ToolRegistry {
  const registry = new ToolRegistry();

  registry.register({
    id: "get_weather",
    name: "get_weather",
    description: "获取指定城市的天气信息",
    execute: async (input) => getWeather(input as { city: string }),
  });

  return registry;
}
