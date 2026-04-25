import { Product } from "@digital-gold/shared";

type SearchMode = "memory" | "opensearch";

interface SearchDocument {
  id: string;
  name: string;
  category: string;
  purity: string;
  priceMin: number;
  priceMax: number;
  weightGrams: number;
  styles: string[];
  occasions: string[];
  description: string;
  embedding?: number[];
}

function getSearchMode(): SearchMode {
  return process.env.SEARCH_MODE === "opensearch" ? "opensearch" : "memory";
}

function getOpenSearchBaseUrl(): string {
  return process.env.OPENSEARCH_URL ?? "http://127.0.0.1:9200";
}

function getOpenSearchIndex(): string {
  return process.env.OPENSEARCH_INDEX ?? "products";
}

function getAuthHeaders(): Record<string, string> {
  const apiKey = process.env.OPENSEARCH_API_KEY;
  if (apiKey) {
    return { Authorization: `ApiKey ${apiKey}` };
  }

  const username = process.env.OPENSEARCH_USERNAME;
  const password = process.env.OPENSEARCH_PASSWORD;
  if (username && password) {
    const token = Buffer.from(`${username}:${password}`).toString("base64");
    return { Authorization: `Basic ${token}` };
  }

  return {};
}

function toSearchDocument(product: Product, embedding?: number[]): SearchDocument {
  return {
    id: product.id,
    name: product.name,
    category: product.category,
    purity: product.purity,
    priceMin: product.priceMin,
    priceMax: product.priceMax,
    weightGrams: product.weightGrams,
    styles: product.styles,
    occasions: product.occasions,
    description: product.description,
    embedding
  };
}

export async function upsertProductDocument(product: Product, embedding?: number[]): Promise<void> {
  if (getSearchMode() !== "opensearch") {
    // eslint-disable-next-line no-console
    console.log(`[search:memory] upsert ${product.id} embedding=${embedding ? embedding.length : 0}`);
    return;
  }

  const response = await fetch(`${getOpenSearchBaseUrl()}/${getOpenSearchIndex()}/_doc/${encodeURIComponent(product.id)}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders()
    },
    body: JSON.stringify(toSearchDocument(product, embedding))
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`OpenSearch upsert failed: ${response.status} ${body}`);
  }
}

export async function updateProductEmbedding(productId: string, embedding: number[]): Promise<void> {
  if (getSearchMode() !== "opensearch") {
    // eslint-disable-next-line no-console
    console.log(`[search:memory] embedding update ${productId} dims=${embedding.length}`);
    return;
  }

  const response = await fetch(`${getOpenSearchBaseUrl()}/${getOpenSearchIndex()}/_update/${encodeURIComponent(productId)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders()
    },
    body: JSON.stringify({ doc: { embedding } })
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`OpenSearch embedding update failed: ${response.status} ${body}`);
  }
}

export async function removeProductDocument(productId: string): Promise<void> {
  if (getSearchMode() !== "opensearch") {
    // eslint-disable-next-line no-console
    console.log(`[search:memory] delete ${productId}`);
    return;
  }

  const response = await fetch(`${getOpenSearchBaseUrl()}/${getOpenSearchIndex()}/_doc/${encodeURIComponent(productId)}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  });

  if (response.status === 404) {
    return;
  }

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`OpenSearch delete failed: ${response.status} ${body}`);
  }
}
