import { LeadEnquiry } from "@digital-gold/shared";

const LEADS: LeadEnquiry[] = [];

export function createLead(payload: Omit<LeadEnquiry, "id" | "createdAt">): LeadEnquiry {
  const enquiry: LeadEnquiry = {
    id: `LEAD-${LEADS.length + 1}`,
    createdAt: new Date().toISOString(),
    ...payload
  };
  LEADS.push(enquiry);
  return enquiry;
}

export function listLeads(): LeadEnquiry[] {
  return LEADS;
}
