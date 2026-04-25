"use client";

import { FormEvent, useState } from "react";
import { getApiBaseUrl } from "../../lib/api";

type SubmitStatus = "idle" | "submitting" | "success" | "error";

interface Props {
  initialProductId?: string;
}

export default function EnquiryForm({ initialProductId = "" }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [productId, setProductId] = useState(initialProductId);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setError("");

    try {
      const response = await fetch(`${getApiBaseUrl()}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          productId: productId || undefined,
          message,
          source: "web"
        })
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? "Unable to submit enquiry");
      }

      setStatus("success");
      setName("");
      setPhone("");
      setProductId("");
      setMessage("");
    } catch (submitError) {
      setStatus("error");
      setError(submitError instanceof Error ? submitError.message : "Unable to submit enquiry");
    }
  }

  return (
    <>
      <h2>Quick Enquiry</h2>
      <p>Share your interest and our team can continue on WhatsApp.</p>
      <form className="form" onSubmit={onSubmit}>
        <label>
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>

        <label>
          Phone
          <input value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </label>

        <label>
          Product ID (optional)
          <input value={productId} onChange={(e) => setProductId(e.target.value)} placeholder="DG-NK-1001" />
        </label>

        <label>
          Requirement
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} required rows={4} />
        </label>

        <button className="button" type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Submitting..." : "Submit enquiry"}
        </button>
      </form>

      {status === "success" && <p className="success">Enquiry submitted successfully.</p>}
      {status === "error" && <p className="error">{error}</p>}
    </>
  );
}
