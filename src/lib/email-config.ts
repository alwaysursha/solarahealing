export function getEmailFrom(): string {
  const from = process.env.EMAIL_FROM?.trim() ?? "";
  if (!from) {
    throw new Error(
      'Missing EMAIL_FROM in environment. Example: Soulara Healing Academy <hello@soularahealing.com>',
    );
  }
  return from;
}
