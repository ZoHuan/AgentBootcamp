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

    return null;
  } catch {
    return null;
  }
}
