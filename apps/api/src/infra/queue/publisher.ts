import { QUEUE_NAMES, QueueMode } from "@digital-gold/shared";

type QueueLike = {
  add: (jobName: string, payload: Record<string, unknown>, options?: Record<string, unknown>) => Promise<unknown>;
};

let queues: Record<string, QueueLike> | null = null;

function getQueueMode(): QueueMode {
  return process.env.QUEUE_MODE === "bullmq" ? "bullmq" : "memory";
}

function getRedisUrl(): string {
  return process.env.REDIS_URL ?? "redis://127.0.0.1:6379";
}

function getQueues(): Record<string, QueueLike> {
  if (queues) {
    return queues;
  }

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Queue } = require("bullmq") as { Queue: new (name: string, opts: Record<string, unknown>) => QueueLike };
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Redis = require("ioredis") as new (url: string, opts?: Record<string, unknown>) => unknown;
  const connection = new Redis(getRedisUrl(), { maxRetriesPerRequest: null });

  queues = {
    [QUEUE_NAMES.catalogIndex]: new Queue(QUEUE_NAMES.catalogIndex, { connection }),
    [QUEUE_NAMES.catalogEmbedding]: new Queue(QUEUE_NAMES.catalogEmbedding, { connection }),
    [QUEUE_NAMES.catalogIndexCleanup]: new Queue(QUEUE_NAMES.catalogIndexCleanup, { connection })
  };
  return queues;
}

async function enqueue(queueName: string, jobName: string, payload: Record<string, unknown>, jobId: string): Promise<void> {
  if (getQueueMode() !== "bullmq") {
    // eslint-disable-next-line no-console
    console.log(`[queue:memory] ${jobName} ${JSON.stringify(payload)}`);
    return;
  }

  try {
    const queue = getQueues()[queueName];
    await queue.add(jobName, payload, {
      jobId,
      removeOnComplete: 50,
      removeOnFail: 200,
      attempts: 3
    });
    // eslint-disable-next-line no-console
    console.log(`[queue:bullmq] enqueued ${jobName} (${jobId})`);
  } catch (error) {
    // Do not fail request path when background queue is unavailable.
    // eslint-disable-next-line no-console
    console.error(`[queue] failed to enqueue ${jobName}`, error);
  }
}

export async function publishCatalogUpsert(productId: string): Promise<void> {
  await enqueue(QUEUE_NAMES.catalogIndex, "index-product", { productId }, `index:${productId}`);
  await enqueue(QUEUE_NAMES.catalogEmbedding, "generate-embedding", { productId }, `embedding:${productId}`);
}

export async function publishCatalogDelete(productId: string): Promise<void> {
  await enqueue(QUEUE_NAMES.catalogIndexCleanup, "remove-product-index", { productId }, `cleanup:${productId}`);
}
