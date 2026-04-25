import { URL } from "node:url";
import { Appointment } from "@digital-gold/shared";
import { readJson, sendJson } from "../../http";
import { repositories } from "../../infra/repositories/container";
import { HttpError, requireString } from "../../validation";

export async function handleBookingRoutes(method: string, pathname: string, _url: URL, req: any, res: any): Promise<boolean> {
  if (method === "GET" && pathname === "/api/bookings") {
    const items = await repositories.booking.list();
    sendJson(res, 200, { items, total: items.length });
    return true;
  }

  if (method === "POST" && pathname === "/api/bookings") {
    try {
      const payload = await readJson<Partial<Omit<Appointment, "id" | "createdAt">>>(req);
      const bookingInput: Omit<Appointment, "id" | "createdAt"> = {
        name: requireString(payload.name, "name"),
        phone: requireString(payload.phone, "phone"),
        date: requireString(payload.date, "date"),
        slot: requireString(payload.slot, "slot"),
        notes: typeof payload.notes === "string" && payload.notes.length > 0 ? payload.notes : undefined
      };

      const booking = await repositories.booking.create(bookingInput);
      sendJson(res, 201, booking);
      return true;
    } catch (error) {
      if (error instanceof HttpError) {
        sendJson(res, error.statusCode, { error: error.message });
        return true;
      }
      sendJson(res, 400, { error: "Invalid JSON payload" });
      return true;
    }
  }

  return false;
}
