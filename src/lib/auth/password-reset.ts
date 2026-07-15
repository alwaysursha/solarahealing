"use server";

import { createHash, randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getEmailSiteUrl } from "@/lib/email/layout";
import { sendPasswordChangedEmail } from "@/lib/email/password-changed";
import { sendPasswordResetEmail } from "@/lib/email/password-reset";

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;
const RESET_IDENTIFIER_PREFIX = "password-reset:";

const GENERIC_REQUEST_SUCCESS =
  "If an account exists for that email, we’ve sent a reset link. Check your inbox.";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function resetIdentifier(email: string) {
  return `${RESET_IDENTIFIER_PREFIX}${normalizeEmail(email)}`;
}

function hashResetToken(rawToken: string) {
  return createHash("sha256").update(rawToken).digest("hex");
}

function emailFromIdentifier(identifier: string) {
  if (!identifier.startsWith(RESET_IDENTIFIER_PREFIX)) {
    return null;
  }
  return identifier.slice(RESET_IDENTIFIER_PREFIX.length);
}

export async function requestPasswordResetAction(emailInput: string) {
  const email = normalizeEmail(emailInput);
  if (!email || !email.includes("@")) {
    return { ok: false as const, error: "Please enter a valid email address." };
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (user?.password) {
      const rawToken = randomBytes(32).toString("base64url");
      const tokenHash = hashResetToken(rawToken);
      const identifier = resetIdentifier(email);
      const expires = new Date(Date.now() + RESET_TOKEN_TTL_MS);

      await prisma.verificationToken.deleteMany({ where: { identifier } });
      await prisma.verificationToken.create({
        data: {
          identifier,
          token: tokenHash,
          expires,
        },
      });

      const resetUrl = `${getEmailSiteUrl()}/auth/reset-password?token=${encodeURIComponent(rawToken)}`;

      void sendPasswordResetEmail({
        name: user.name,
        email: user.email,
        resetUrl,
      }).catch((error) => {
        console.error("[email] password-reset unexpected error", error);
      });
    }
  } catch (error) {
    console.error("[auth] requestPasswordResetAction failed", error);
  }

  return { ok: true as const, message: GENERIC_REQUEST_SUCCESS };
}

export async function resetPasswordAction(input: {
  token: string;
  password: string;
  confirmPassword: string;
}) {
  const rawToken = input.token.trim();
  const password = input.password;
  const confirmPassword = input.confirmPassword;

  if (!rawToken) {
    return { ok: false as const, error: "This reset link is missing or invalid." };
  }

  if (password.length < 8) {
    return {
      ok: false as const,
      error: "Please choose a password of at least 8 characters.",
    };
  }

  if (password !== confirmPassword) {
    return { ok: false as const, error: "Passwords do not match." };
  }

  const tokenHash = hashResetToken(rawToken);
  const record = await prisma.verificationToken.findUnique({
    where: { token: tokenHash },
  });

  if (!record || record.expires.getTime() < Date.now()) {
    if (record) {
      await prisma.verificationToken.deleteMany({
        where: { identifier: record.identifier },
      });
    }
    return {
      ok: false as const,
      error: "This reset link is invalid or has expired. Request a new one.",
    };
  }

  const email = emailFromIdentifier(record.identifier);
  if (!email) {
    await prisma.verificationToken.deleteMany({
      where: { identifier: record.identifier },
    });
    return { ok: false as const, error: "This reset link is invalid or has expired." };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    await prisma.verificationToken.deleteMany({
      where: { identifier: record.identifier },
    });
    return { ok: false as const, error: "This reset link is invalid or has expired." };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { password: await bcrypt.hash(password, 12) },
  });

  await prisma.verificationToken.deleteMany({
    where: { identifier: record.identifier },
  });

  void sendPasswordChangedEmail({
    name: user.name,
    email: user.email,
  }).catch((error) => {
    console.error("[email] password-changed unexpected error", error);
  });

  return { ok: true as const };
}
