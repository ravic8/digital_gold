import { LeadEnquiry } from "@digital-gold/shared";
import { getApiBaseUrl, safeJsonFetch } from "../../../lib/api";

interface LeadListResponse {
  items: LeadEnquiry[];
}

async function getLeads(): Promise<LeadEnquiry[]> {
  const apiBase = getApiBaseUrl();
  const data = await safeJsonFetch<LeadListResponse>(`${apiBase}/api/leads`, { cache: "no-store" });
  return data?.items ?? [];
}

function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("en-IN", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

export default async function AdminLeadsPage() {
  const leads = await getLeads();

  return (
    <section>
      <h2>Admin Leads</h2>
      <p>Recent enquiries captured from website and WhatsApp channels.</p>

      {leads.length === 0 ? (
        <p className="empty">No leads yet. Submit an enquiry to validate the end-to-end workflow.</p>
      ) : (
        <div className="tableWrap">
          <table className="table">
            <thead>
              <tr>
                <th>Created</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Product ID</th>
                <th>Source</th>
                <th>Requirement</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td>{formatDateTime(lead.createdAt)}</td>
                  <td>{lead.name}</td>
                  <td>{lead.phone}</td>
                  <td>{lead.productId ?? "-"}</td>
                  <td>
                    <span className="badge">{lead.source}</span>
                  </td>
                  <td>{lead.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
