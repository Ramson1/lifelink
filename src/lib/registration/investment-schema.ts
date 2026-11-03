import { z } from "zod";

/**
 * Zod schema for the LifeLink Investment and Savings subscription form.
 *
 * Captures ALL fields from the official physical subscription form:
 *   Part A — Personal & Contact Information
 *   Part B — KYC & Regulatory Compliance Verification
 *   Part C — Investment & Payment Details
 *
 * The base fields (fullName, email, phone, address, nextOfKinName,
 * nextOfKinPhone, passport) overlap with the generic registrationSchema
 * so the same `lifelink_users` columns are populated. The remaining
 * investment-specific fields are stored in the `investment_data` JSONB column.
 */
export const investmentRegistrationSchema = z.object({
  // ---- Base fields (map to lifelink_users columns) ----
  service: z.literal("investment"),
  fullName: z.string().min(3, "Please enter your full name"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  address: z.string().min(5, "Please enter your address"),
  occupation: z.string().optional().default(""),
  nextOfKinName: z.string().min(3, "Next of kin name is required"),
  nextOfKinPhone: z.string().min(7, "Next of kin phone is required"),
  notes: z.string().max(1200).default(""),
  passport: z.string().default(""),

  // ---- Part A extras ----
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  nationality: z.string().min(2, "Nationality is required"),

  // ---- Part B: KYC & Regulatory Compliance ----
  idType: z.enum(["nin", "voters_card", "international_passport"], {
    message: "Please select an ID type",
  }),
  idNumber: z.string().min(5, "ID card number is required"),
  idDocumentUrl: z.string().default(""),
  proofOfAddressUrl: z.string().default(""),
  nextOfKinRelationship: z.string().min(2, "Relationship is required"),

  // ---- Part C: Investment & Payment Details ----
  investmentTier: z.enum(
    ["starter", "growth", "builder", "gold", "strategic", "premium"],
    { message: "Please select an investment tier" },
  ),
  investmentAmount: z.string().min(1, "Investment amount is required"),
  investmentDuration: z.enum(["90", "120", "180", "365"], {
    message: "Please select an investment duration",
  }),
  paymentMethod: z.enum(["bank_transfer", "teller"], {
    message: "Please select a payment method",
  }),
  paymentReference: z.string().min(1, "Payment reference is required"),
  bankName: z.string().min(2, "Bank name is required"),
  accountName: z.string().min(2, "Account name is required"),
  accountNumber: z.string().min(9, "Please enter a valid account number"),
});

export type InvestmentRegistrationValues = z.infer<
  typeof investmentRegistrationSchema
>;

/**
 * Extract the investment_data JSONB payload from a full form submission.
 * These are the fields that go into the `investment_data` column on
 * `lifelink_users` (everything beyond the base registration columns).
 */
export function extractInvestmentData(values: InvestmentRegistrationValues) {
  return {
    dateOfBirth: values.dateOfBirth,
    nationality: values.nationality,
    idType: values.idType,
    idNumber: values.idNumber,
    idDocumentUrl: values.idDocumentUrl,
    proofOfAddressUrl: values.proofOfAddressUrl,
    nextOfKinRelationship: values.nextOfKinRelationship,
    investmentTier: values.investmentTier,
    investmentAmount: values.investmentAmount,
    investmentDuration: values.investmentDuration,
    paymentMethod: values.paymentMethod,
    paymentReference: values.paymentReference,
    bankName: values.bankName,
    accountName: values.accountName,
    accountNumber: values.accountNumber,
  };
}

/** Investment tier definitions used by the form and the sector page. */
export const INVESTMENT_TIERS = [
  {
    key: "starter",
    label: "Starter Pioneer",
    range: "₦50,000 – ₦249,999",
    category: "Entry-Level Investment",
    monthlyInterest: "₦1,500 – ₦7,500",
  },
  {
    key: "growth",
    label: "Growth Pioneer",
    range: "₦250,000 – ₦499,999",
    category: "Growth-Level Investment",
    monthlyInterest: "₦7,500 – ₦15,000",
  },
  {
    key: "builder",
    label: "Builder Pioneer",
    range: "₦500,000 – ₦999,999",
    category: "Builder-Level Investment",
    monthlyInterest: "₦15,000 – ₦30,000",
  },
  {
    key: "gold",
    label: "Gold Pioneer",
    range: "₦1,000,000 – ₦2,499,999",
    category: "Major Contributor",
    monthlyInterest: "₦30,000 – ₦75,000",
  },
  {
    key: "strategic",
    label: "Strategic Pioneer",
    range: "₦2,500,000 – ₦4,999,999",
    category: "Strategic Investment",
    monthlyInterest: "₦75,000 – ₦150,000",
  },
  {
    key: "premium",
    label: "Premium Pioneer",
    range: "₦5,000,000 and above",
    category: "Premium Investment",
    monthlyInterest: "₦150,000 and above",
  },
] as const;

export const INVESTMENT_DURATIONS = [
  { value: "90", label: "90 Days" },
  { value: "120", label: "120 Days" },
  { value: "180", label: "180 Days" },
  { value: "365", label: "365 Days" },
] as const;

export const ID_TYPES = [
  { value: "nin", label: "NIN (National Identity Number)" },
  { value: "voters_card", label: "Voter's Card" },
  { value: "international_passport", label: "International Passport" },
] as const;

export const PAYMENT_METHODS = [
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "teller", label: "Teller" },
] as const;
