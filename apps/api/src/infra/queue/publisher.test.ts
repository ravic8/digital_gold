import assert from "node:assert/strict";
import test from "node:test";
import { publishCatalogDelete, publishCatalogUpsert } from "./publisher";

const originalQueueMode = process.env.QUEUE_MODE;

test.beforeEach(() => {
  process.env.QUEUE_MODE = "memory";
});

test.afterEach(() => {
  process.env.QUEUE_MODE = originalQueueMode;
});

test("publishCatalogUpsert logs both index and embedding jobs in memory mode", async () => {
  const logs: string[] = [];
  const originalLog = console.log;
  console.log = (...args: unknown[]) => {
    logs.push(args.map(String).join(" "));
  };

  try {
    await publishCatalogUpsert("DG-TEST-1");
  } finally {
    console.log = originalLog;
  }

  assert.equal(logs.length, 2);
  assert.ok(logs.some((line) => line.includes("index-product") && line.includes("DG-TEST-1")));
  assert.ok(logs.some((line) => line.includes("generate-embedding") && line.includes("DG-TEST-1")));
});

test("publishCatalogDelete logs cleanup job in memory mode", async () => {
  const logs: string[] = [];
  const originalLog = console.log;
  console.log = (...args: unknown[]) => {
    logs.push(args.map(String).join(" "));
  };

  try {
    await publishCatalogDelete("DG-TEST-2");
  } finally {
    console.log = originalLog;
  }

  assert.equal(logs.length, 1);
  assert.ok(logs[0].includes("remove-product-index") && logs[0].includes("DG-TEST-2"));
});
