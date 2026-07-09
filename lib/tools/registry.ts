interface ToolDefinition {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: {
      type: "object";
      properties: Record<string, { type: string; description: string }>;
      required: string[];
    };
  };
}

interface Tool {
  definition: ToolDefinition;
  execute: (args: Record<string, unknown>) => string;
}

const toolMap = new Map<string, Tool>();

export function registerTool(
  definition: ToolDefinition,
  execute: (args: Record<string, unknown>) => string
) {
  toolMap.set(definition.function.name, { definition, execute });
}

export function getAllDefinitions(): ToolDefinition[] {
  return Array.from(toolMap.values()).map((t) => t.definition);
}

export function getTool(name: string): Tool | undefined {
  return toolMap.get(name);
}
