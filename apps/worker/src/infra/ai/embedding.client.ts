export type EmbeddingMode = "mock" | "openai-compatible";

function getEmbeddingMode(): EmbeddingMode {
  return process.env.EMBEDDING_MODE === "openai-compatible" ? "openai-compatible" : "mock";
}

function createMockEmbedding(text: string, dimensions = 16): number[] {
  const result: number[] = [];
  let seed = 0;
  for (let i = 0; i < text.length; i += 1) {
    seed = (seed * 31 + text.charCodeAt(i)) >>> 0;
  }

  for (let i = 0; i < dimensions; i += 1) {
    const value = ((seed + i * 2654435761) % 1000) / 1000;
    result.push(Number((value * 2 - 1).toFixed(6)));
  }

  return result;
}

async function createOpenAiCompatibleEmbedding(text: string): Promise<number[]> {
  const baseUrl = process.env.EMBEDDING_API_BASE_URL;
  const apiKey = process.env.EMBEDDING_API_KEY;
  const model = process.env.EMBEDDING_MODEL ?? "text-embedding-3-small";

  if (!baseUrl || !apiKey) {
    throw new Error("EMBEDDING_API_BASE_URL and EMBEDDING_API_KEY are required for openai-compatible mode");
  }

  const response = await fetch(`${baseUrl}/embeddings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({ model, input: text })
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Embedding API failed: ${response.status} ${body}`);
  }

  const payload = (await response.json()) as {
    data?: Array<{ embedding?: number[] }>;
  };

  const vector = payload.data?.[0]?.embedding;
  if (!vector || !Array.isArray(vector)) {
    throw new Error("Embedding API response missing embedding vector");
  }

  return vector;
}

export async function generateEmbedding(text: string): Promise<number[]> {
  if (getEmbeddingMode() === "openai-compatible") {
    return createOpenAiCompatibleEmbedding(text);
  }

  return createMockEmbedding(text);
}
