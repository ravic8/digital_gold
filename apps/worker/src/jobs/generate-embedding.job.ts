import { generateEmbedding } from "../infra/ai/embedding.client";
import { fetchProductById } from "../infra/http/catalog-api.client";
import { updateProductEmbedding } from "../infra/search/opensearch.client";

export interface GenerateEmbeddingJobPayload {
  productId: string;
  text?: string;
}

export async function runGenerateEmbeddingJob(payload: GenerateEmbeddingJobPayload): Promise<void> {
  let sourceText = payload.text;
  if (!sourceText) {
    const product = await fetchProductById(payload.productId);
    if (!product) {
      // eslint-disable-next-line no-console
      console.warn(`[worker] embedding skipped, missing product ${payload.productId}`);
      return;
    }
    sourceText = `${product.name}. ${product.description}. Styles: ${product.styles.join(", ")}. Occasions: ${product.occasions.join(", ")}`;
  }

  const vector = await generateEmbedding(sourceText);
  await updateProductEmbedding(payload.productId, vector);
  // eslint-disable-next-line no-console
  console.log(`[worker] generate-embedding completed for ${payload.productId} (dims=${vector.length})`);
}
