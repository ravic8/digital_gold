import { QUEUE_NAMES, QueueMode } from "@digital-gold/shared";
import { runGenerateEmbeddingJob } from "../jobs/generate-embedding.job";
import { runIndexProductJob } from "../jobs/index-product.job";
import { runRemoveProductIndexJob } from "../jobs/remove-product-index.job";

type WorkerLike = {
  on: (event: string, cb: (...args: unknown[]) => void) => void;
};

function getQueueMode(): QueueMode {
  return process.env.QUEUE_MODE === "bullmq" ? "bullmq" : "memory";
}

function getRedisUrl(): string {
  return process.env.REDIS_URL ?? "redis://127.0.0.1:6379";
}

export async function startBullMqConsumers(): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Worker } = require("bullmq") as {
    Worker: new (
      queueName: string,
      processor: (job: { name: string; data: Record<string, unknown> }) => Promise<void>,
      opts: Record<string, unknown>
    ) => WorkerLike;
  };
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Redis = require("ioredis") as new (url: string, opts?: Record<string, unknown>) => unknown;
  const connection = new Redis(getRedisUrl(), { maxRetriesPerRequest: null });

  const workers: WorkerLike[] = [
    new Worker(
      QUEUE_NAMES.catalogIndex,
      async (job) => {
        await runIndexProductJob({ productId: String(job.data.productId ?? "") });
      },
      { connection, concurrency: 5 }
    ),
    new Worker(
      QUEUE_NAMES.catalogEmbedding,
      async (job) => {
        await runGenerateEmbeddingJob({
          productId: String(job.data.productId ?? ""),
          text: typeof job.data.text === "string" ? job.data.text : undefined
        });
      },
      { connection, concurrency: 3 }
    ),
    new Worker(
      QUEUE_NAMES.catalogIndexCleanup,
      async (job) => {
        await runRemoveProductIndexJob({ productId: String(job.data.productId ?? "") });
      },
      { connection, concurrency: 5 }
    )
  ];

  for (const worker of workers) {
    worker.on("completed", () => {
      // eslint-disable-next-line no-console
      console.log("[worker] job completed");
    });
    worker.on("failed", (job, error) => {
      // eslint-disable-next-line no-console
      console.error("[worker] job failed", job, error);
    });
  }
}

export function shouldRunBullMq(): boolean {
  return getQueueMode() === "bullmq";
}
