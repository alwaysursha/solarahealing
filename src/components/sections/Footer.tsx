import { Logo } from "@/components/ui/Logo";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-purple-deep/8 px-6 py-12 md:px-12 lg:px-16">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 md:flex-row md:items-start">
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <Logo variant="dark" />
          <p className="mt-4 text-sm text-purple-deep/45">
            {site.sanskritMeaning}
          </p>
        </div>
        <p className="text-sm text-purple-deep/40">
          &copy; 2026 {site.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
