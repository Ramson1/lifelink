import { Resend } from "resend";

let cached: Resend | null = null;

function getClient(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!cached) cached = new Resend(key);
  return cached;
}

export interface SendEmailInput {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

export interface SendEmailResult {
  ok: boolean;
  error?: string;
}

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const client = getClient();
  if (!client) {
    return { ok: false, error: "RESEND_API_KEY is not configured" };
  }
  const from = input.from ?? process.env.RESEND_FROM_EMAIL ?? "notifications@lifelink.example";
  try {
    const { data, error } = await client.emails.send({
      from,
      to: Array.isArray(input.to) ? input.to : [input.to],
      subject: input.subject,
      html: input.html,
    });
    if (error) {
      return { ok: false, error: error.message ?? "Resend error" };
    }
    return { ok: true, error: data?.id };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
