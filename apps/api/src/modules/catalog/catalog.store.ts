import { Product, ProductSearchQuery } from "@digital-gold/shared";

const PRODUCTS: Product[] = [
  {
    id: "DG-NK-1001",
    name: "Temple Heritage Necklace",
    category: "necklace",
    priceMin: 185000,
    priceMax: 225000,
    purity: "22k",
    weightGrams: 42,
    styles: ["traditional", "temple"],
    occasions: ["wedding", "festival"],
    images: ["https://example.com/products/DG-NK-1001-1.jpg"],
    description: "Traditional temple-inspired necklace with antique finish."
  },
  {
    id: "DG-RG-2201",
    name: "Floral Gold Ring",
    category: "ring",
    priceMin: 28000,
    priceMax: 36000,
    purity: "22k",
    weightGrams: 6.2,
    styles: ["floral", "modern"],
    occasions: ["engagement", "casual"],
    images: ["https://example.com/products/DG-RG-2201-1.jpg"],
    description: "Floral motif ring for daily elegance and gifting."
  }
];

export function listProducts(query: ProductSearchQuery): Product[] {
  return PRODUCTS.filter((product) => {
    if (query.category && product.category !== query.category) {
      return false;
    }
    if (query.purity && product.purity !== query.purity) {
      return false;
    }
    if (query.minPrice !== undefined && product.priceMin < query.minPrice) {
      return false;
    }
    if (query.maxPrice !== undefined && product.priceMax > query.maxPrice) {
      return false;
    }
    if (query.style && !product.styles.includes(query.style)) {
      return false;
    }
    if (query.q) {
      const token = query.q.toLowerCase();
      const text = `${product.name} ${product.description} ${product.styles.join(" ")}`.toLowerCase();
      if (!text.includes(token)) {
        return false;
      }
    }
    return true;
  });
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((product) => product.id === id);
}

export function createProduct(product: Product): Product {
  PRODUCTS.unshift(product);
  return product;
}

export function updateProduct(id: string, patch: Partial<Omit<Product, "id">>): Product | undefined {
  const index = PRODUCTS.findIndex((product) => product.id === id);
  if (index < 0) {
    return undefined;
  }

  const updated = { ...PRODUCTS[index], ...patch, id };
  PRODUCTS[index] = updated;
  return updated;
}

export function deleteProduct(id: string): boolean {
  const index = PRODUCTS.findIndex((product) => product.id === id);
  if (index < 0) {
    return false;
  }

  PRODUCTS.splice(index, 1);
  return true;
}
