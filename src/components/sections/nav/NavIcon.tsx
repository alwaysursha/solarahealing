export type NavIconId = "reiki" | "healing" | "nutrition" | "transformation";

type NavIconProps = {
  id: NavIconId;
  className?: string;
};

export function NavIcon({ id, className = "h-4 w-4" }: NavIconProps) {
  switch (id) {
    case "reiki":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1M5.6 18.4l2.1-2.1m8.6-8.6 2.1-2.1"
          />
          <circle cx="12" cy="12" r="3.25" strokeLinecap="round" strokeLinejoin="round" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.75v6.5M8.75 12h6.5" />
        </svg>
      );
    case "healing":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 20.25c3.5-3.25 5.75-6.35 5.75-9.35a5.75 5.75 0 10-11.5 0c0 3 2.25 6.1 5.75 9.35z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.5v4.25" />
        </svg>
      );
    case "nutrition":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 21s6-4.5 6-10a4.5 4.5 0 00-9-2.25A4.5 4.5 0 006 11c0 5.5 6 10 6 10z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 11v10" />
        </svg>
      );
    case "transformation":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5c-2.2 2.6-3.25 4.65-3.25 6.75a3.25 3.25 0 106.5 0c0-2.1-1.05-4.15-3.25-6.75z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 17.25c1.2 1.35 2.85 2.25 4.5 2.25s3.3-.9 4.5-2.25" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 20.25h6" />
        </svg>
      );
    default: {
      const _exhaustive: never = id;
      return _exhaustive;
    }
  }
}
