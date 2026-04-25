import { IncomingMessage } from "node:http";

export async function readJson<T>(req: IncomingMessage): Promise<T> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.from(chunk));
  }

  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) {
    throw new Error("Request body is empty");
  }

  return JSON.parse(raw) as T;
}

export function sendJson(res: { writeHead: (code: number, headers: Record<string, string>) => void; end: (body?: string) => void }, code: number, data: unknown): void {
  res.writeHead(code, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

export function notFound(res: { writeHead: (code: number, headers: Record<string, string>) => void; end: (body?: string) => void }): void {
  sendJson(res, 404, { error: "Not Found" });
}
