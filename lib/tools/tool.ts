export interface Tool {
  id: string;
  name: string;
  description: string;
  execute(input: unknown): Promise<unknown>;
}
