import { Tool } from "./tool";
import { ToolRegistry } from "./registry";

const keywordMap: Record<string, string> = {
  weather: "get_weather",
  天气: "get_weather",
};

export class ToolSelector {
  private registry: ToolRegistry;

  constructor(registry: ToolRegistry) {
    this.registry = registry;
  }

  select(userInput: string): Tool | null {
    const lower = userInput.toLowerCase();

    for (const [keyword, toolId] of Object.entries(keywordMap)) {
      if (lower.includes(keyword)) {
        return this.registry.get(toolId) ?? null;
      }
    }

    return null;
  }
}
