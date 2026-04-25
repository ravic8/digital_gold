import assert from "node:assert/strict";
import test from "node:test";
import { Product } from "@digital-gold/shared";
import { runGenerateEmbeddingJob } from "./jobs/generate-embedding.job";
import { runIndexProductJob } from "./jobs/index-product.job";
import { runRemoveProductIndexJob } from "./jobs/remove-product-index.job";

const originalFetch = global.fetch;
const originalSearchMode = process.env.SEARCH_MODE;

const SAMPLE_PRODUCT: Product = {
  id: "DG-TST-1001",
  name: "Test Necklace",
  category: "necklace",
  priceMin: 100000,
  priceMax: 150000,
  purity: "22k",
  weightGrams: 20,
  styles: ["traditional"],
  occasions: ["wedding"],
  images: ["https://example.com/dg-tst-1001.jpg"],
  description: "Test description"
};

function withMockFetch(handler: (url: string) => Promise<Response>) {
  global.fetch = (async (input: RequestInfo | URL) => {
    const url = typeof input === "string" ? input : input.toString();
    return handler(url);
  }) as typeof fetch;
}

test.beforeEach(() => {
  process.env.SEARCH_MODE = "memory";
});

test.afterEach(() => {
  global.fetch = originalFetch;
  process.env.SEARCH_MODE = originalSearchMode;
});

test("runIndexProductJob fetches product and upserts into search adapter", async () => {
  let fetchCount = 0;

  withMockFetch(async (url) => {
    fetchCount += 1;
    assert.match(url, /\/api\/catalog\/products\/DG-TST-1001$/);
    return new Response(JSON.stringify(SAMPLE_PRODUCT), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  });

  await runIndexProductJob({ productId: "DG-TST-1001" });
  assert.equal(fetchCount, 1);
});

test("runGenerateEmbeddingJob fetches product and generates embedding when text is absent", async () => {
  let fetchCount = 0;

  withMockFetch(async () => {
    fetchCount += 1;
    return new Response(JSON.stringify(SAMPLE_PRODUCT), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  });

  await runGenerateEmbeddingJob({ productId: "DG-TST-1001" });
  assert.equal(fetchCount, 1);
});

test("runRemoveProductIndexJob executes successfully in memory search mode", async () => {
  await runRemoveProductIndexJob({ productId: "DG-TST-1001" });
});
