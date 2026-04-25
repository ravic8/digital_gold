import { URL } from "node:url";
import { AiRecommendationRequest, AiRecommendationResponse } from "@digital-gold/shared";
import { readJson, sendJson } from "../../http";
import { HttpError, requireString } from "../../validation";

export async function handleAiRoutes(method: string, pathname: string, _url: URL, req: any, res: any): Promise<boolean> {
  if (method === "POST" && pathname === "/api/ai/recommendations") {
    try {
      const payload = await readJson<AiRecommendationRequest>(req);
      const prompt = requireString(payload.prompt, "prompt");

      const response: AiRecommendationResponse = {
        answer: `For request \"${prompt}\", start with traditional 22k options and refine by occasion and budget.`,
        recommendedProductIds: ["DG-NK-1001", "DG-RG-2201"]
      };

      sendJson(res, 200, response);
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
