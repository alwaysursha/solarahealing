const AUTH_PATH_PREFIX = "/auth/";

export function resolvePostLoginRedirectUrl(
  callbackUrl: string,
  role?: string | null,
): string {
  const destination = callbackUrl || "/";

  if (role === "ADMIN" && !destination.startsWith("/admin")) {
    return "/admin";
  }

  return destination;
}

export async function getPostLoginRedirectUrl(callbackUrl: string): Promise<string> {
  if (typeof window === "undefined") {
    return callbackUrl || "/";
  }

  const { getSession } = await import("next-auth/react");
  let session = await getSession();

  if (!session?.user?.role) {
    await new Promise((resolve) => window.setTimeout(resolve, 100));
    session = await getSession();
  }

  return resolvePostLoginRedirectUrl(callbackUrl, session?.user?.role);
}

export function markPostLoginRedirectPending() {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem("post-login-redirect", "1");
}

export function consumePostLoginRedirect(callbackUrl: string, role?: string | null): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  if (window.sessionStorage.getItem("post-login-redirect") !== "1") {
    return null;
  }

  window.sessionStorage.removeItem("post-login-redirect");
  return resolvePostLoginRedirectUrl(callbackUrl, role);
}

export function getAuthCallbackUrl(fallback = "/"): string {
  if (typeof window === "undefined") {
    return fallback;
  }

  const path = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (!path || path === "/" || path.startsWith(AUTH_PATH_PREFIX)) {
    return fallback;
  }

  return path;
}

export function getFirstName(name: string | null | undefined): string {
  if (!name?.trim()) {
    return "Friend";
  }

  return name.trim().split(/\s+/)[0] ?? "Friend";
}

/** Default session lifetime — rolling refresh keeps users signed in across visits. */
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;
/** How often an active visit extends the session cookie (sliding window). */
export const SESSION_UPDATE_AGE_SECONDS = 60 * 60 * 24;

export const HEADER_LOGIN_TARGET_ID = "header-login-target";
export const PENDING_ENROLLMENT_STORAGE_KEY = "soulara-pending-enrollment";
