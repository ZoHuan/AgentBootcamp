export interface Evaluation {
  success: boolean;
  confidence: number;
  reason: string;
  retry: boolean;
}

export class Reflector {
  evaluate(responseText: string): Evaluation {
    if (responseText.length === 0) {
      return { success: false, confidence: 0, reason: "响应为空", retry: true };
    }

    const lower = responseText.toLowerCase();
    const errorPatterns = ["error", "failed", "500", "timeout", "unavailable"];

    for (const pattern of errorPatterns) {
      if (lower.includes(pattern)) {
        return {
          success: false,
          confidence: 0.3,
          reason: `检测到错误关键词: "${pattern}"`,
          retry: true,
        };
      }
    }

    return {
      success: true,
      confidence: 0.9,
      reason: "响应内容完整",
      retry: false,
    };
  }
}
