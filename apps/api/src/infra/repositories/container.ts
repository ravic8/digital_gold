import { BookingRepository, CatalogRepository, LeadRepository } from "./types";
import { createProduct, deleteProduct, getProductById, listProducts, updateProduct } from "../../modules/catalog/catalog.store";
import { createLead, listLeads } from "../../modules/lead/lead.store";
import { createAppointment, listAppointments } from "../../modules/booking/booking.store";
import { PostgresCatalogRepository } from "./postgres/catalog.repository";
import { PostgresLeadRepository } from "./postgres/lead.repository";
import { PostgresBookingRepository } from "./postgres/booking.repository";

class InMemoryCatalogRepository implements CatalogRepository {
  async list(query: Parameters<typeof listProducts>[0]) {
    return listProducts(query);
  }

  async getById(id: string) {
    return getProductById(id) ?? null;
  }

  async create(product: Parameters<typeof createProduct>[0]) {
    return createProduct(product);
  }

  async update(id: string, patch: Parameters<typeof updateProduct>[1]) {
    return updateProduct(id, patch) ?? null;
  }

  async remove(id: string) {
    return deleteProduct(id);
  }
}

class InMemoryLeadRepository implements LeadRepository {
  async list() {
    return listLeads();
  }

  async create(payload: Parameters<typeof createLead>[0]) {
    return createLead(payload);
  }
}

class InMemoryBookingRepository implements BookingRepository {
  async list() {
    return listAppointments();
  }

  async create(payload: Parameters<typeof createAppointment>[0]) {
    return createAppointment(payload);
  }
}

function createRepositories(): {
  catalog: CatalogRepository;
  lead: LeadRepository;
  booking: BookingRepository;
} {
  const mode = process.env.REPOSITORY_MODE ?? (process.env.DATABASE_URL ? "postgres" : "memory");
  if (mode === "postgres") {
    // eslint-disable-next-line no-console
    console.log("[repo] using postgres repositories");
    return {
      catalog: new PostgresCatalogRepository(),
      lead: new PostgresLeadRepository(),
      booking: new PostgresBookingRepository()
    };
  }

  // eslint-disable-next-line no-console
  console.log("[repo] using in-memory repositories");
  return {
    catalog: new InMemoryCatalogRepository(),
    lead: new InMemoryLeadRepository(),
    booking: new InMemoryBookingRepository()
  };
}

export const repositories = createRepositories();
