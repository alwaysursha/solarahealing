import Image from "next/image";

export function AuraDiagramVisual({
  title,
  lead,
  image,
}: {
  title: string;
  lead: string;
  image: { src: string; alt: string; width: number; height: number };
}) {
  return (
    <div className="cm-aura-diagram">
      <header className="cm-aura-diagram-head">
        <h2 className="cm-aura-diagram-title">{title}</h2>
        <p className="cm-aura-diagram-lead">{lead}</p>
      </header>

      <div className="cm-aura-diagram-art">
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          className="cm-aura-diagram-img"
          style={{ borderRadius: "1.25rem" }}
          quality={100}
          unoptimized
          priority
        />
      </div>
    </div>
  );
}
