export interface Span {
  id: string;
  name: string;
  parentId?: string;
  startedAt: Date;
  endedAt?: Date;
  status: "running" | "success" | "failed";
}
