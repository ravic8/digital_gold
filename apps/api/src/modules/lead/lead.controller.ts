import { URL } from "node:url";
import { LeadEnquiry } from "@digital-gold/shared";
import { readJson, sendJson } from "../../http";
import { repositories } from "../../infra/repositories/container";
import { HttpError, requireOneOf, requireString } from "../../validation";

export async function handleLeadRoutes(method: string, pathname: string, _url: URL, req: any, res: any): Promise<boolean> {
  if (method === "GET" && pathname === "/api/leads") {
    const items = await repositories.lead.list();
    sendJson(res, 200, { items, total: items.length });
    return true;
  }

  if (method === "POST" && pathname === "/api/leads") {
    try {
      const payload = await readJson<Partial<Omit<LeadEnquiry, "id" | "createdAt">>>(req);
      const leadInput: Omit<LeadEnquiry, "id" | "createdAt"> = {
        name: requireString(payload.name, "name"),
        phone: requireString(payload.phone, "phone"),
        message: requireString(payload.message, "message"),
        source: requireOneOf(payload.source, "source", ["whatsapp", "web"]),
        productId: typeof payload.productId === "string" && payload.productId.length > 0 ? payload.productId : undefined
      };

      const lead = await repositories.lead.create(leadInput);
      sendJson(res, 201, lead);
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
