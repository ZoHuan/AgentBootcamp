export interface Evaluation { success: boolean; confidence: number; reason: string; retry: boolean; }
export interface Metrics { successRate: number; averageLatency: number; toolSelectionAccuracy: number; }
