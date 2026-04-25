import { fetchProductById } from "../infra/http/catalog-api.client";
import { upsertProductDocument } from "../infra/search/opensearch.client";

export interface IndexProductJobPayload {
  productId: string;
}

export async function runIndexProductJob(payload: IndexProductJobPayload): Promise<void> {
  const product = await fetchProductById(payload.productId);
  if (!product) {
    // eslint-disable-next-line no-console
    console.warn(`[worker] index-product skipped, missing product ${payload.productId}`);
    return;
  }

  await upsertProductDocument(product);
  // eslint-disable-next-line no-console
  console.log(`[worker] index-product completed for ${payload.productId}`);
}
