import { Product, ProductSearchQuery } from "@digital-gold/shared";

// Phase 3 stub: replace with OpenSearch SDK wiring.
export async function indexProductForSearch(_product: Product): Promise<void> {
  return;
}

// Phase 3 stub: hybrid search (keyword + filter + vector) will be implemented here.
export async function searchProducts(_query: ProductSearchQuery): Promise<string[]> {
  return [];
}
