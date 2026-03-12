import { z } from "zod";

export const appointmentSchema = z.object({
  customerName: z.string().min(2, "Name is required"),
  email: z.string().email("Enter valid email address"),
  date: z.string(),
  startTime: z.string(),
  serviceId: z.number().int().positive()
});

export type AppointmentInput = z.infer<typeof appointmentSchema>;