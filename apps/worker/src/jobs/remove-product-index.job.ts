import { removeProductDocument } from "../infra/search/opensearch.client";

export interface RemoveProductIndexJobPayload {
  productId: string;
}

export async function runRemoveProductIndexJob(payload: RemoveProductIndexJobPayload): Promise<void> {
  await removeProductDocument(payload.productId);
  // eslint-disable-next-line no-console
  console.log(`[worker] remove-product-index completed for ${payload.productId}`);
}
