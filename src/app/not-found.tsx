import Link from "next/link";

export const dynamic = "force-dynamic";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-6 py-20 text-center">
      <h1 className="font-display text-4xl font-semibold text-purple-deep">404</h1>
      <p className="mt-3 text-purple-deep/60">This page could not be found.</p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-gold px-8 py-3 text-sm font-medium text-purple-deep"
      >
        Return home
      </Link>
    </div>
  );
}
