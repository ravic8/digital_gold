import { Product } from "@digital-gold/shared";

function getApiBaseUrl(): string {
  return process.env.API_BASE_URL ?? "http://127.0.0.1:4000";
}

export async function fetchProductById(productId: string): Promise<Product | null> {
  const response = await fetch(`${getApiBaseUrl()}/api/catalog/products/${productId}`);
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`Failed to fetch product ${productId}: ${response.status}`);
  }

  return (await response.json()) as Product;
}
