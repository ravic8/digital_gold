"use client";

import { FormEvent, useState } from "react";
import { getApiBaseUrl } from "../../lib/api";

type SubmitStatus = "idle" | "submitting" | "success" | "error";

export default function BookAppointmentPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("11:00-11:30");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setError("");

    try {
      const response = await fetch(`${getApiBaseUrl()}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, date, slot, notes: notes || undefined })
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? "Unable to book appointment");
      }

      setStatus("success");
      setName("");
      setPhone("");
      setDate("");
      setSlot("11:00-11:30");
      setNotes("");
    } catch (submitError) {
      setStatus("error");
      setError(submitError instanceof Error ? submitError.message : "Unable to book appointment");
    }
  }

  return (
    <section>
      <h2>Book Appointment</h2>
      <p>Reserve a consultation slot with our jewellery advisor.</p>
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
          Date
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </label>

        <label>
          Slot
          <select value={slot} onChange={(e) => setSlot(e.target.value)}>
            <option value="11:00-11:30">11:00-11:30</option>
            <option value="11:30-12:00">11:30-12:00</option>
            <option value="16:00-16:30">16:00-16:30</option>
            <option value="16:30-17:00">16:30-17:00</option>
          </select>
        </label>

        <label>
          Notes (optional)
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
        </label>

        <button className="button" type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Submitting..." : "Book appointment"}
        </button>
      </form>

      {status === "success" && <p className="success">Appointment booked successfully.</p>}
      {status === "error" && <p className="error">{error}</p>}
    </section>
  );
}
