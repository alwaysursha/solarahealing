import Image from "next/image";

export function BalancingChakrasVisual() {
  return (
    <div className="cm-balancing">
      <Image
        src="/course-material/introduction-to-reiki/balancing-chakras-infographic.png"
        alt="Balancing chakras: ways to keep your energy centers balanced, with ten practices around a meditating figure"
        width={1536}
        height={1024}
        className="cm-balancing-infographic"
        style={{ borderRadius: "1.25rem" }}
        quality={100}
        unoptimized
        priority
      />
    </div>
  );
}
