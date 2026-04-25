import { Appointment } from "@digital-gold/shared";

const APPOINTMENTS: Appointment[] = [];

export function createAppointment(payload: Omit<Appointment, "id" | "createdAt">): Appointment {
  const appointment: Appointment = {
    id: `APT-${APPOINTMENTS.length + 1}`,
    createdAt: new Date().toISOString(),
    ...payload
  };
  APPOINTMENTS.push(appointment);
  return appointment;
}

export function listAppointments(): Appointment[] {
  return APPOINTMENTS;
}
