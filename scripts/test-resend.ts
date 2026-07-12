import { config } from "dotenv";
import { Resend } from "resend";

config({ path: ".env.local" });

async function main() {
  const apiKey = process.env.RESEND_API_KEY?.trim() ?? "";
  const from = process.env.EMAIL_FROM?.trim() ?? "";
  const to =
    process.env.EMAIL_TEST_TO?.trim() ||
    process.env.ADMIN_EMAIL?.trim() ||
    "admin@soularahealing.com";

  if (!apiKey) {
    throw new Error("Missing RESEND_API_KEY in .env.local");
  }
  if (!from) {
    throw new Error("Missing EMAIL_FROM in .env.local");
  }

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from,
    to,
    subject: "Soulara Healing Academy · test email",
    text: "This is a test email from Soulara Healing Academy. Resend is working.",
    html: `
      <div style="font-family: Georgia, serif; max-width: 32rem; margin: 0 auto; padding: 1.5rem; color: #3a2560;">
        <p style="font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; color: #d4ad35;">
          Soulara Healing Academy
        </p>
        <h1 style="font-size: 1.6rem; font-weight: 400; margin: 0.5rem 0 1rem;">Test email</h1>
        <p style="line-height: 1.55; color: rgba(58, 37, 96, 0.78);">
          This is a test email from Soulara Healing Academy. Resend is working.
        </p>
      </div>
    `,
  });

  if (error) {
    console.error("FAILED:", error.message);
    process.exit(1);
  }

  console.log("OK — sent test email");
  console.log("to:", to);
  console.log("id:", data?.id ?? "(none)");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
