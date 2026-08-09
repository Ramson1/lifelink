import { z } from "zod";

import { ServiceKey } from "@/lib/brand";

export const serviceKeySchema = z.custom<ServiceKey>((v) => typeof v === "string");

export const registrationSchema = z.object({
  service: z.enum([
    "humanitarian",
    "finance",
    "trading",
    "affiliate",
    "mlm",
    "production",
    "investment",
    "landbanking",
    "transport",
    "agriculture",
    "oilgas",
    "digital",
  ]),
  fullName: z.string().min(3),
  email: z.string().email(),
  phone: z.string().min(7),
  address: z.string().min(5),
  occupation: z.string().min(2),
  nextOfKinName: z.string().min(3),
  nextOfKinPhone: z.string().min(7),
  notes: z.string().max(1200).default(""),
});

export type RegistrationValues = z.infer<typeof registrationSchema>;
