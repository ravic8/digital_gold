export type ProductCategory = "necklace" | "ring" | "earring" | "bangle" | "bridal-set";

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  priceMin: number;
  priceMax: number;
  purity: "18k" | "22k" | "24k";
  weightGrams: number;
  styles: string[];
  occasions: string[];
  images: string[];
  description: string;
}

export interface ProductSearchQuery {
  category?: ProductCategory;
  minPrice?: number;
  maxPrice?: number;
  purity?: "18k" | "22k" | "24k";
  style?: string;
  q?: string;
}

export interface LeadEnquiry {
  id: string;
  name: string;
  phone: string;
  productId?: string;
  message: string;
  source: "whatsapp" | "web";
  createdAt: string;
}

export interface Appointment {
  id: string;
  name: string;
  phone: string;
  date: string;
  slot: string;
  notes?: string;
  createdAt: string;
}

export interface AiRecommendationRequest {
  prompt: string;
  budgetMin?: number;
  budgetMax?: number;
  category?: ProductCategory;
}

export interface AiRecommendationResponse {
  answer: string;
  recommendedProductIds: string[];
}
