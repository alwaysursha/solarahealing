import { SITE_NAME, getSiteUrl } from "@/lib/constants";

const EMAIL_LOGO_PATH = "/brand/Soulara-logo-transparent.png";

export const EMAIL_BRAND = {
  purpleDeep: "#5C1A94",
  purpleMid: "#9D4DAE",
  purpleDark: "#2c164a",
  purplePanel: "#44226c",
  gold: "#D4AD35",
  goldLight: "#EECF78",
  cream: "#FAF7F2",
  text: "#3a2560",
  textMuted: "rgba(58, 37, 96, 0.72)",
  textSoft: "rgba(58, 37, 96, 0.55)",
  border: "rgba(92, 26, 148, 0.12)",
} as const;

/** Prefer production CDN/site for logo so emails render even in local dev. */
export function getEmailAssetBaseUrl(): string {
  const explicit = process.env.EMAIL_ASSET_BASE_URL?.trim();
  if (explicit) {
    return explicit.replace(/\/$/, "");
  }

  const site = getSiteUrl().replace(/\/$/, "");
  if (site.includes("localhost") || site.includes("127.0.0.1")) {
    return "https://soularahealing.com";
  }
  return site;
}

export function getEmailLogoUrl(): string {
  return `${getEmailAssetBaseUrl()}${EMAIL_LOGO_PATH}`;
}

export function getEmailSiteUrl(): string {
  return getSiteUrl().replace(/\/$/, "");
}

export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function firstNameFrom(name: string | null | undefined, fallback = "friend"): string {
  const trimmed = name?.trim() ?? "";
  if (!trimmed) {
    return fallback;
  }
  return trimmed.split(/\s+/)[0] ?? fallback;
}

export function emailCtaButton(label: string, href: string): string {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 1.5rem 0 0;">
      <tr>
        <td style="border-radius: 999px; background: linear-gradient(135deg, ${EMAIL_BRAND.goldLight} 0%, ${EMAIL_BRAND.gold} 100%);">
          <a href="${escapeHtml(href)}"
             style="display: inline-block; padding: 0.85rem 1.35rem; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 0.78rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; text-decoration: none; color: ${EMAIL_BRAND.purpleDeep};">
            ${escapeHtml(label)}
          </a>
        </td>
      </tr>
    </table>
  `;
}

export type EmailShellInput = {
  preheader: string;
  eyebrow?: string;
  title: string;
  bodyHtml: string;
  footerNote?: string;
};

/** Shared Soulara letterhead — logo, purple/gold, email-client-safe tables. */
export function renderEmailShell(input: EmailShellInput): string {
  const logoUrl = getEmailLogoUrl();
  const siteUrl = getEmailSiteUrl();
  const year = new Date().getFullYear();
  const eyebrow = input.eyebrow ?? SITE_NAME;
  const footerNote =
    input.footerNote ??
    `You’re receiving this because you have an account or order with ${SITE_NAME}.`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <title>${escapeHtml(input.title)}</title>
</head>
<body style="margin: 0; padding: 0; background: #f3ecf8; -webkit-font-smoothing: antialiased;">
  <div style="display: none; max-height: 0; overflow: hidden; opacity: 0; mso-hide: all;">
    ${escapeHtml(input.preheader)}
  </div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #f3ecf8; padding: 28px 14px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 560px; width: 100%;">
          <tr>
            <td style="border-radius: 22px; overflow: hidden; border: 1px solid ${EMAIL_BRAND.border}; background: #ffffff; box-shadow: 0 24px 60px -36px rgba(44, 22, 74, 0.45);">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding: 28px 28px 22px; background: linear-gradient(165deg, ${EMAIL_BRAND.purplePanel} 0%, ${EMAIL_BRAND.purpleDark} 72%, #1f0f38 100%); text-align: center;">
                    <a href="${escapeHtml(siteUrl)}" style="display: inline-block; text-decoration: none;">
                      <img src="${escapeHtml(logoUrl)}"
                           width="220"
                           alt="${escapeHtml(SITE_NAME)}"
                           style="display: block; margin: 0 auto; width: 220px; max-width: 72%; height: auto; border: 0;" />
                    </a>
                    <p style="margin: 18px 0 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 0.62rem; font-weight: 600; letter-spacing: 0.24em; text-transform: uppercase; color: ${EMAIL_BRAND.goldLight};">
                      ${escapeHtml(eyebrow)}
                    </p>
                    <h1 style="margin: 10px 0 0; font-family: Georgia, 'Times New Roman', serif; font-size: 28px; line-height: 1.15; font-weight: 400; letter-spacing: -0.02em; color: ${EMAIL_BRAND.cream};">
                      ${escapeHtml(input.title)}
                    </h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 28px 28px 32px; font-family: Georgia, 'Times New Roman', serif; color: ${EMAIL_BRAND.text}; background:
                    radial-gradient(ellipse at 100% 0%, rgba(212, 173, 53, 0.08), transparent 42%),
                    #ffffff;">
                    ${input.bodyHtml}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 18px 12px 0; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 12px; line-height: 1.55; color: ${EMAIL_BRAND.textSoft};">
              <p style="margin: 0;">${escapeHtml(footerNote)}</p>
              <p style="margin: 10px 0 0;">
                <a href="${escapeHtml(siteUrl)}" style="color: ${EMAIL_BRAND.purpleMid}; text-decoration: none;">${escapeHtml(SITE_NAME)}</a>
                · © ${year}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function paragraph(htmlOrText: string, muted = false): string {
  return `<p style="margin: 0 0 1rem; font-size: 16px; line-height: 1.6; color: ${muted ? EMAIL_BRAND.textMuted : EMAIL_BRAND.text};">${htmlOrText}</p>`;
}

export function mutedNote(text: string): string {
  return `<p style="margin: 1.25rem 0 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 13px; line-height: 1.5; color: ${EMAIL_BRAND.textSoft};">${escapeHtml(text)}</p>`;
}
