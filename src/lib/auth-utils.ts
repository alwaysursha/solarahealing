const AUTH_PATH_PREFIX = "/auth/";

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

/** Default session lifetime — keep customers signed in across visits. */
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 90;
