import type { ReactNode } from "react";

type InnerPageProps = {
  title: string;
  description?: string;
  children?: ReactNode;
};

export function InnerPage({ title, description, children }: InnerPageProps) {
  return (
    <div className="px-6 py-10 md:px-12 lg:px-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-3xl font-semibold text-purple-deep md:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-3 text-purple-deep/65">{description}</p>
        ) : null}
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </div>
  );
}
