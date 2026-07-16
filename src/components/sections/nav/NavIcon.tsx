export type NavIconId = "reiki" | "courses" | "sessions" | "blog" | "contact";

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
    case "courses":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 5.25c1.8-.9 3.9-.9 5.7 0v13.5c-1.8-.9-3.9-.9-5.7 0V5.25Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.8 5.25c1.8-.9 3.9-.9 5.7 0v13.5c-1.8-.9-3.9-.9-5.7 0V5.25Z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 5.25v13.5" />
        </svg>
      );
    case "sessions":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
          <circle cx="9" cy="8.25" r="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="16.25" cy="9" r="2" strokeLinecap="round" strokeLinejoin="round" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 18.75c.6-2.7 2.7-4.2 5.25-4.2s4.65 1.5 5.25 4.2"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.1 14.7c1.65-.35 3.3.35 4.15 1.95"
          />
        </svg>
      );
    case "blog":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5.25 4.5h13.5A.75.75 0 0 1 19.5 5.25v13.5a.75.75 0 0 1-.75.75H5.25a.75.75 0 0 1-.75-.75V5.25a.75.75 0 0 1 .75-.75Z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 8.25h7.5M8.25 12h7.5M8.25 15.75h4.5" />
        </svg>
      );
    case "contact":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75A2.25 2.25 0 0 1 6 4.5h12a2.25 2.25 0 0 1 2.25 2.25v10.5A2.25 2.25 0 0 1 18 19.5H6a2.25 2.25 0 0 1-2.25-2.25V6.75Z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 7.5 7.5 5.25L19.5 7.5" />
        </svg>
      );
    default: {
      const _exhaustive: never = id;
      return _exhaustive;
    }
  }
}
