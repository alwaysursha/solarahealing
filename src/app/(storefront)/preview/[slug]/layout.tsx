import { BrandThemePreviewGate } from "@/components/shell/BrandThemePreviewGate";
import { brandThemeFromSlug } from "@/lib/brand-theme";

type PreviewLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

export default async function BrandThemePreviewLayout({ children, params }: PreviewLayoutProps) {
  const { slug } = await params;
  const option = brandThemeFromSlug(slug);

  return (
    <>
      {option ? (
        <>
          <script
            dangerouslySetInnerHTML={{
              __html: `document.documentElement.setAttribute("data-brand-theme","${option}");`,
            }}
          />
          <BrandThemePreviewGate option={option} />
        </>
      ) : null}
      {children}
    </>
  );
}
