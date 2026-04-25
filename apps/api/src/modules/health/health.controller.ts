import { URL } from "node:url";
import { sendJson } from "../../http";

export function handleHealthRoutes(method: string, pathname: string, _url: URL, res: any): boolean {
  if (method === "GET" && pathname === "/api/health") {
    const repositoryMode = process.env.REPOSITORY_MODE ?? (process.env.DATABASE_URL ? "postgres" : "memory");
    const queueMode = process.env.QUEUE_MODE ?? "memory";
    sendJson(res, 200, {
      status: "ok",
      service: "digital-gold-api",
      timestamp: new Date().toISOString(),
      repositoryMode,
      queueMode
    });
    return true;
  }

  return false;
}
