"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { getApiBaseUrl } from "../lib/api";

interface ProductLite {
  id: string;
  name: string;
}

interface Props {
  products: ProductLite[];
}

interface RecommendationResponse {
  answer: string;
  recommendedProductIds: string[];
}

type Status = "idle" | "loading" | "success" | "error";

const CATEGORY_OPTIONS = ["", "necklace", "ring", "earring", "bangle", "bridal-set"] as const;

export default function AiStylistPanel({ products }: Props) {
  const [prompt, setPrompt] = useState("Suggest premium wedding jewellery under 2.5L");
  const [category, setCategory] = useState<string>("");
  const [budgetMin, setBudgetMin] = useState<string>("");
  const [budgetMax, setBudgetMax] = useState<string>("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [result, setResult] = useState<RecommendationResponse | null>(null);

  const productById = useMemo(() => {
    const map = new Map<string, ProductLite>();
    for (const product of products) {
      map.set(product.id, product);
    }
    return map;
  }, [products]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setError("");

    try {
      const response = await fetch(`${getApiBaseUrl()}/api/ai/recommendations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          category: category || undefined,
          budgetMin: budgetMin ? Number(budgetMin) : undefined,
          budgetMax: budgetMax ? Number(budgetMax) : undefined
        })
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? "Unable to fetch recommendations");
      }

      const payload = (await response.json()) as RecommendationResponse;
      setResult(payload);
      setStatus("success");
    } catch (submitError) {
      setStatus("error");
      setError(submitError instanceof Error ? submitError.message : "Unable to fetch recommendations");
    }
  }

  return (
    <aside className="aiPanel">
      <p className="eyebrow">AI STYLIST</p>
      <h3>Get Personalized Picks</h3>
      <p>Describe your style and budget to receive instant recommendations.</p>

      <form onSubmit={onSubmit} className="aiForm">
        <label>
          What are you looking for?
          <textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} rows={3} required />
        </label>

        <div className="aiRow">
          <label>
            Category
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              {CATEGORY_OPTIONS.map((option) => (
                <option key={option || "all"} value={option}>
                  {option ? option : "Any"}
                </option>
              ))}
            </select>
          </label>

          <label>
            Budget Min
            <input type="number" min={0} value={budgetMin} onChange={(event) => setBudgetMin(event.target.value)} />
          </label>

          <label>
            Budget Max
            <input type="number" min={0} value={budgetMax} onChange={(event) => setBudgetMax(event.target.value)} />
          </label>
        </div>

        <button type="submit" className="button" disabled={status === "loading"}>
          {status === "loading" ? "Thinking..." : "Ask Stylist"}
        </button>
      </form>

      {status === "error" && <p className="error">{error}</p>}

      {result && (
        <div className="aiResult">
          <p className="aiAnswer">{result.answer}</p>
          <ul>
            {result.recommendedProductIds.map((id) => {
              const product = productById.get(id);
              return (
                <li key={id}>
                  <Link href={product ? `/catalog/${product.id}` : "/"}>{product?.name ?? id}</Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </aside>
  );
}
