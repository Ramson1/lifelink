import { z } from "zod";

export const registrationSchema = z.object({
  service: z.string().min(1, "Please select a sector"),
  fullName: z.string().min(3),
  email: z.string().email(),
  phone: z.string().min(7),
  address: z.string().min(5),
  occupation: z.string().min(2),
  nextOfKinName: z.string().min(3),
  nextOfKinPhone: z.string().min(7),
  notes: z.string().max(1200).default(""),
  passport: z.string().default(""),
});

export type RegistrationValues = z.infer<typeof registrationSchema>;
