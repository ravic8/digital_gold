import { randomUUID } from "node:crypto";
import { Appointment } from "@digital-gold/shared";
import { getDbPool } from "../../postgres/client";
import { BookingRepository } from "../types";

interface BookingRow {
  id: string;
  name: string;
  phone: string;
  appointment_date: string;
  slot: string;
  notes: string | null;
  created_at: Date;
}

function toAppointment(row: BookingRow): Appointment {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    date: row.appointment_date,
    slot: row.slot,
    notes: row.notes ?? undefined,
    createdAt: new Date(row.created_at).toISOString()
  };
}

export class PostgresBookingRepository implements BookingRepository {
  async list(): Promise<Appointment[]> {
    const result = await getDbPool().query<BookingRow>(
      `SELECT id, name, phone, appointment_date, slot, notes, created_at
       FROM appointments ORDER BY created_at DESC LIMIT 500`
    );

    return result.rows.map(toAppointment);
  }

  async create(payload: Omit<Appointment, "id" | "createdAt">): Promise<Appointment> {
    const id = `APT-${randomUUID().slice(0, 8)}`;
    const result = await getDbPool().query<BookingRow>(
      `INSERT INTO appointments (id, name, phone, appointment_date, slot, notes)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, name, phone, appointment_date, slot, notes, created_at`,
      [id, payload.name, payload.phone, payload.date, payload.slot, payload.notes ?? null]
    );

    return toAppointment(result.rows[0]);
  }
}
