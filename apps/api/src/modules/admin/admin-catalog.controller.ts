import { URL } from "node:url";
import { Product, ProductCategory } from "@digital-gold/shared";
import { readJson, sendJson } from "../../http";
import { publishCatalogDelete, publishCatalogUpsert } from "../../infra/queue/publisher";
import { repositories } from "../../infra/repositories/container";
import { HttpError, requireNumber, requireOneOf, requireString, requireStringArray } from "../../validation";

const PRODUCT_CATEGORIES: ProductCategory[] = ["necklace", "ring", "earring", "bangle", "bridal-set"];
const PURITIES: Product["purity"][] = ["18k", "22k", "24k"];

function parseCreatePayload(payload: unknown): Product {
  if (typeof payload !== "object" || payload === null) {
    throw new HttpError(400, "Invalid payload");
  }

  const body = payload as Record<string, unknown>;
  return {
    id: requireString(body.id, "id"),
    name: requireString(body.name, "name"),
    category: requireOneOf(body.category, "category", PRODUCT_CATEGORIES),
    priceMin: requireNumber(body.priceMin, "priceMin"),
    priceMax: requireNumber(body.priceMax, "priceMax"),
    purity: requireOneOf(body.purity, "purity", PURITIES),
    weightGrams: requireNumber(body.weightGrams, "weightGrams"),
    styles: requireStringArray(body.styles, "styles"),
    occasions: requireStringArray(body.occasions, "occasions"),
    images: requireStringArray(body.images, "images"),
    description: requireString(body.description, "description")
  };
}

function parsePatchPayload(payload: unknown): Partial<Omit<Product, "id">> {
  if (typeof payload !== "object" || payload === null) {
    throw new HttpError(400, "Invalid payload");
  }

  const body = payload as Record<string, unknown>;
  const patch: Partial<Omit<Product, "id">> = {};

  if (body.name !== undefined) patch.name = requireString(body.name, "name");
  if (body.category !== undefined) patch.category = requireOneOf(body.category, "category", PRODUCT_CATEGORIES);
  if (body.priceMin !== undefined) patch.priceMin = requireNumber(body.priceMin, "priceMin");
  if (body.priceMax !== undefined) patch.priceMax = requireNumber(body.priceMax, "priceMax");
  if (body.purity !== undefined) patch.purity = requireOneOf(body.purity, "purity", PURITIES);
  if (body.weightGrams !== undefined) patch.weightGrams = requireNumber(body.weightGrams, "weightGrams");
  if (body.styles !== undefined) patch.styles = requireStringArray(body.styles, "styles");
  if (body.occasions !== undefined) patch.occasions = requireStringArray(body.occasions, "occasions");
  if (body.images !== undefined) patch.images = requireStringArray(body.images, "images");
  if (body.description !== undefined) patch.description = requireString(body.description, "description");

  if (Object.keys(patch).length === 0) {
    throw new HttpError(400, "At least one field is required for patch update");
  }

  return patch;
}

export async function handleAdminCatalogRoutes(
  method: string,
  pathname: string,
  _url: URL,
  req: any,
  res: any
): Promise<boolean> {
  if (method === "POST" && pathname === "/api/admin/catalog/products") {
    try {
      const payload = await readJson(req);
      const product = parseCreatePayload(payload);
      const existing = await repositories.catalog.getById(product.id);
      if (existing) {
        sendJson(res, 409, { error: `Product ${product.id} already exists` });
        return true;
      }

      const created = await repositories.catalog.create(product);
      await publishCatalogUpsert(created.id);
      sendJson(res, 201, created);
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

  if (method === "PATCH" && pathname.startsWith("/api/admin/catalog/products/")) {
    try {
      const id = pathname.split("/").pop() ?? "";
      const payload = await readJson(req);
      const patch = parsePatchPayload(payload);
      const updated = await repositories.catalog.update(id, patch);
      if (!updated) {
        sendJson(res, 404, { error: "Product not found" });
        return true;
      }

      await publishCatalogUpsert(updated.id);
      sendJson(res, 200, updated);
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

  if (method === "DELETE" && pathname.startsWith("/api/admin/catalog/products/")) {
    const id = pathname.split("/").pop() ?? "";
    const removed = await repositories.catalog.remove(id);
    if (!removed) {
      sendJson(res, 404, { error: "Product not found" });
      return true;
    }

    await publishCatalogDelete(id);
    sendJson(res, 200, { status: "deleted", id });
    return true;
  }

  return false;
}
