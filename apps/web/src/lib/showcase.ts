import { Product } from "@digital-gold/shared";

const ADJECTIVES = ["Regal", "Signature", "Timeless", "Grand", "Classic", "Imperial"];
const CRAFTS = ["Hand-set detailing", "Temple filigree", "Precision cast finish", "Kundan inspired layering", "Floral lattice carving"];

function hashSeed(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function seededRange(seed: number, min: number, max: number): number {
  const normalized = (seed % 1000) / 1000;
  return Math.round(min + (max - min) * normalized);
}

export function getProductImageUrl(product: Product): string {
  const seed = hashSeed(product.id);
  const lock = (seed % 90) + 10;
  // Online image source for rich visual placeholders.
  return `https://loremflickr.com/900/1100/jewellery,gold?lock=${lock}`;
}

export function getProductVisualMeta(product: Product): {
  headline: string;
  finalPrice: number;
  makingCharge: number;
  craftNote: string;
  popularity: number;
} {
  const seed = hashSeed(product.id);
  const midpoint = Math.round((product.priceMin + product.priceMax) / 2);
  const finalPrice = midpoint + seededRange(seed + 7, 12000, 78000);
  const makingCharge = seededRange(seed + 13, 4500, 22000);
  const popularity = seededRange(seed + 29, 82, 99);

  return {
    headline: `${ADJECTIVES[seed % ADJECTIVES.length]} ${product.category}`,
    finalPrice,
    makingCharge,
    craftNote: CRAFTS[seed % CRAFTS.length],
    popularity
  };
}
