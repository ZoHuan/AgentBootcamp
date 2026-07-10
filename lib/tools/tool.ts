export interface Tool {
  id: string;
  name: string;
  description: string;
  tags?: string[];
  category?: string;
  priority?: number;
  execute(input: unknown): Promise<unknown>;
}
