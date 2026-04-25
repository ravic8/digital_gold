export const QUEUE_NAMES = {
  catalogIndex: "catalog-index",
  catalogEmbedding: "catalog-embedding",
  catalogIndexCleanup: "catalog-index-cleanup"
} as const;

export type QueueName = (typeof QUEUE_NAMES)[keyof typeof QUEUE_NAMES];
export type QueueMode = "memory" | "bullmq";
