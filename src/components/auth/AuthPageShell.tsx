import type { ReactNode } from "react";

type AuthPageShellProps = {
  eyebrow: string;
  title: string;
  titleAccent?: string;
  description: string;
  children: ReactNode;
};

export function AuthPageShell({
  eyebrow,
  title,
  titleAccent,
  description,
  children,
}: AuthPageShellProps) {
  return (
    <div className="auth-page">
      <div className="auth-page-aura" aria-hidden />
      <div className="auth-page-inner">
        <header className="auth-page-hero">
          <p className="auth-page-eyebrow">{eyebrow}</p>
          <h1 className="auth-page-title">
            {title}
            {titleAccent ? <span> {titleAccent}</span> : null}
          </h1>
          <p className="auth-page-copy">{description}</p>
        </header>

        <div className="auth-page-card">{children}</div>
      </div>
    </div>
  );
}
