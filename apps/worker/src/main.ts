import { runGenerateEmbeddingJob } from "./jobs/generate-embedding.job";
import { runIndexProductJob } from "./jobs/index-product.job";
import { shouldRunBullMq, startBullMqConsumers } from "./lib/queue";

async function runWorkerLoop(): Promise<void> {
  // Placeholder flow until BullMQ consumers are connected.
  await runIndexProductJob({ productId: "DG-NK-1001" });
  await runGenerateEmbeddingJob({
    productId: "DG-NK-1001",
    text: "Traditional temple-inspired necklace with antique finish."
  });
  // eslint-disable-next-line no-console
  console.log(`[worker] heartbeat: ${new Date().toISOString()}`);
}

async function bootstrap(): Promise<void> {
  if (shouldRunBullMq()) {
    await startBullMqConsumers();
    // eslint-disable-next-line no-console
    console.log("[worker] BullMQ consumers started");
    return;
  }

  // Fallback mode for local development without Redis/BullMQ.
  setInterval(() => {
    runWorkerLoop().catch((error) => {
      // eslint-disable-next-line no-console
      console.error("[worker] loop failure", error);
    });
  }, 15000);

  await runWorkerLoop();
}

bootstrap().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("[worker] startup failure", error);
});
