import { randomUUID } from "node:crypto";
import { LeadEnquiry } from "@digital-gold/shared";
import { getDbPool } from "../../postgres/client";
import { LeadRepository } from "../types";

interface LeadRow {
  id: string;
  name: string;
  phone: string;
  product_id: string | null;
  message: string;
  source: LeadEnquiry["source"];
  created_at: Date;
}

function toLead(row: LeadRow): LeadEnquiry {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    productId: row.product_id ?? undefined,
    message: row.message,
    source: row.source,
    createdAt: new Date(row.created_at).toISOString()
  };
}

export class PostgresLeadRepository implements LeadRepository {
  async list(): Promise<LeadEnquiry[]> {
    const result = await getDbPool().query<LeadRow>(
      `SELECT id, name, phone, product_id, message, source, created_at
       FROM leads ORDER BY created_at DESC LIMIT 500`
    );

    return result.rows.map(toLead);
  }

  async create(payload: Omit<LeadEnquiry, "id" | "createdAt">): Promise<LeadEnquiry> {
    const id = `LEAD-${randomUUID().slice(0, 8)}`;
    const result = await getDbPool().query<LeadRow>(
      `INSERT INTO leads (id, name, phone, product_id, message, source)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, name, phone, product_id, message, source, created_at`,
      [id, payload.name, payload.phone, payload.productId ?? null, payload.message, payload.source]
    );

    return toLead(result.rows[0]);
  }
}
