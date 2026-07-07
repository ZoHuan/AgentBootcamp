interface MemoryEntry {
  role: string;
  content: string;
}

export class MemoryManager {
  private entries: MemoryEntry[] = [];
  private maxEntries: number;

  constructor(maxEntries = 10) {
    this.maxEntries = maxEntries;
  }

  save(role: string, content: string): void {
    this.entries.push({ role, content });
    if (this.entries.length > this.maxEntries) {
      this.entries = this.entries.slice(-this.maxEntries);
    }
  }

  load(): MemoryEntry[] {
    return [...this.entries];
  }

  clear(): void {
    this.entries = [];
  }

  formatHistory(): string {
    if (this.entries.length === 0) return "";
    return this.entries
      .map((e) => `${e.role === "user" ? "User" : "Assistant"}: ${e.content}`)
      .join("\n");
  }
}
