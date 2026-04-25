import { createServer } from "node:http";
import { URL } from "node:url";
import { notFound, sendJson } from "./http";
import { handleCatalogRoutes } from "./modules/catalog/catalog.controller";
import { handleLeadRoutes } from "./modules/lead/lead.controller";
import { handleBookingRoutes } from "./modules/booking/booking.controller";
import { handleAiRoutes } from "./modules/ai/ai.controller";
import { handleHealthRoutes } from "./modules/health/health.controller";
import { handleAdminCatalogRoutes } from "./modules/admin/admin-catalog.controller";

const port = Number(process.env.PORT || 4000);

const server = createServer(async (req, res) => {
  const method = req.method ?? "GET";
  const url = new URL(req.url ?? "/", `http://${req.headers.host}`);
  const pathname = url.pathname;

  try {
    if (handleHealthRoutes(method, pathname, url, res)) {
      return;
    }

    if (await handleCatalogRoutes(method, pathname, url, res)) {
      return;
    }

    if (await handleLeadRoutes(method, pathname, url, req, res)) {
      return;
    }

    if (await handleBookingRoutes(method, pathname, url, req, res)) {
      return;
    }

    if (await handleAiRoutes(method, pathname, url, req, res)) {
      return;
    }

    if (await handleAdminCatalogRoutes(method, pathname, url, req, res)) {
      return;
    }

    notFound(res);
  } catch (error) {
    sendJson(res, 500, { error: "Internal server error", details: String(error) });
  }
});

server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API running on http://localhost:${port}`);
});
