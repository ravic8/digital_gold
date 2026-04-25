import { Appointment, LeadEnquiry, Product, ProductSearchQuery } from "@digital-gold/shared";

export interface CatalogRepository {
  list(query: ProductSearchQuery): Promise<Product[]>;
  getById(id: string): Promise<Product | null>;
  create(product: Product): Promise<Product>;
  update(id: string, patch: Partial<Omit<Product, "id">>): Promise<Product | null>;
  remove(id: string): Promise<boolean>;
}

export interface LeadRepository {
  list(): Promise<LeadEnquiry[]>;
  create(payload: Omit<LeadEnquiry, "id" | "createdAt">): Promise<LeadEnquiry>;
}

export interface BookingRepository {
  list(): Promise<Appointment[]>;
  create(payload: Omit<Appointment, "id" | "createdAt">): Promise<Appointment>;
}
