import { Providers } from "@/components/Providers";
import { Footer } from "@/components/sections/Footer";
import { Header } from "@/components/sections/Header";
import { SiteShell } from "@/components/shell/SiteShell";

export const dynamic = "force-dynamic";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <SiteShell header={<Header />}>
        {children}
        <Footer />
      </SiteShell>
    </Providers>
  );
}
