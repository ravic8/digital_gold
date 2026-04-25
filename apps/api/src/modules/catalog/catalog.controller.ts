import { URL } from "node:url";
import { ProductSearchQuery } from "@digital-gold/shared";
import { sendJson } from "../../http";
import { repositories } from "../../infra/repositories/container";

export async function handleCatalogRoutes(method: string, pathname: string, url: URL, res: any): Promise<boolean> {
  if (method === "GET" && pathname === "/api/catalog/products") {
    const query: ProductSearchQuery = {
      category: (url.searchParams.get("category") as ProductSearchQuery["category"]) ?? undefined,
      purity: (url.searchParams.get("purity") as ProductSearchQuery["purity"]) ?? undefined,
      style: url.searchParams.get("style") ?? undefined,
      q: url.searchParams.get("q") ?? undefined,
      minPrice: url.searchParams.get("minPrice") ? Number(url.searchParams.get("minPrice")) : undefined,
      maxPrice: url.searchParams.get("maxPrice") ? Number(url.searchParams.get("maxPrice")) : undefined
    };
    const items = await repositories.catalog.list(query);

    sendJson(res, 200, { items, total: items.length });
    return true;
  }

  if (method === "GET" && pathname.startsWith("/api/catalog/products/")) {
    const id = pathname.split("/").pop() ?? "";
    const product = await repositories.catalog.getById(id);
    if (!product) {
      sendJson(res, 404, { error: "Product not found" });
      return true;
    }

    sendJson(res, 200, product);
    return true;
  }

  return false;
}
