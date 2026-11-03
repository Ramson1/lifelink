import { NextResponse } from "next/server";

import { createServiceClient } from "@/lib/admin/supabase";
import { registrationSchema } from "@/lib/registration/schema";
import {
  extractInvestmentData,
  investmentRegistrationSchema,
} from "@/lib/registration/investment-schema";

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);

  // Investment subscriptions use the extended schema and populate the
  // `investment_data` JSONB column with the Part B + C fields.
  if (json && typeof json === "object" && json.service === "investment") {
    const parsed = investmentRegistrationSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      );
    }

    const supabase = createServiceClient();
    const { error } = await supabase.from("lifelink_users").insert({
      service_key: parsed.data.service,
      full_name: parsed.data.fullName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      address: parsed.data.address,
      occupation: parsed.data.occupation ?? "",
      next_of_kin_name: parsed.data.nextOfKinName,
      next_of_kin_phone: parsed.data.nextOfKinPhone,
      notes: parsed.data.notes ?? "",
      passport_url: parsed.data.passport ?? "",
      investment_data: extractInvestmentData(parsed.data),
      status: "new",
      source: "website",
    });

    if (error) {
      console.error("Investment registration insert failed:", error.message, error.details);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  }

  const parsed = registrationSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { error } = await supabase.from("lifelink_users").insert({
    service_key: parsed.data.service,
    full_name: parsed.data.fullName,
    email: parsed.data.email,
    phone: parsed.data.phone,
    address: parsed.data.address,
    occupation: parsed.data.occupation,
    next_of_kin_name: parsed.data.nextOfKinName,
    next_of_kin_phone: parsed.data.nextOfKinPhone,
    notes: parsed.data.notes ?? "",
    passport_url: parsed.data.passport ?? "",
    status: "new",
    source: "website",
  });

  if (error) {
    console.error("Registration insert failed:", error.message, error.details);
    return NextResponse.json(
      { error: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
