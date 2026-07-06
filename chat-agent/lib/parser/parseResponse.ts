import { Answer } from "@/lib/schemas/answer";

export function parseResponse(raw: string): Answer | null {
  try {
    let json = raw.trim();

    if (json.startsWith("```")) {
      json = json.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
    }

    const parsed = JSON.parse(json);

    if (
      typeof parsed.title === "string" &&
      typeof parsed.summary === "string" &&
      Array.isArray(parsed.examples)
    ) {
      return parsed as Answer;
    }

    console.warn("[parseResponse] JSON 格式不匹配 Answer schema:", parsed);
    return null;
  } catch (err) {
    console.warn("[parseResponse] JSON 解析失败:", err instanceof Error ? err.message : err);
    return null;
  }
}
