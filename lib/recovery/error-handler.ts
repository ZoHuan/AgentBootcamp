export type ErrorAction = "retry" | "recover" | "throw";

export class ErrorHandler {
  classify(error: Error): ErrorAction {
    const msg = error.message.toLowerCase();

    if (msg.includes("timeout") || msg.includes("econnrefused") || msg.includes("network")) {
      return "retry";
    }

    if (msg.includes("rate") && msg.includes("limit")) {
      return "retry";
    }

    if (msg.includes("validation") || msg.includes("parse")) {
      return "recover";
    }

    return "throw";
  }
}
