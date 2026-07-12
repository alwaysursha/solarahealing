import { config } from "dotenv";
import { sendEmail } from "../src/lib/email";

config({ path: ".env.local" });

async function main() {
  const to =
    process.env.EMAIL_TEST_TO?.trim() ||
    process.env.ADMIN_EMAIL?.trim() ||
    process.env.EMAIL_ADMIN_TO?.trim() ||
    "admin@soularahealing.com";

  const result = await sendEmail({
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

  if (!result.ok) {
    console.error("FAILED:", result.error);
    process.exit(1);
  }

  console.log("OK — sent test email");
  console.log("to:", to);
  console.log("id:", result.id);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
