export interface LLMMessage { role: "system" | "user" | "assistant" | "tool"; content: string; tool_call_id?: string; tool_calls?: unknown[]; }
export interface LLMResponse { content: string | null; toolCalls?: unknown[]; }
export interface LLMClient { chat(messages: LLMMessage[]): Promise<LLMResponse>; stream(messages: LLMMessage[]): AsyncIterable<string>; }
