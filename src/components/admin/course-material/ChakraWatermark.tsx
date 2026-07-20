"use client";

import Image from "next/image";
import { useState } from "react";

export function ChakraWatermark() {
  const [revealed, setRevealed] = useState(false);

  return (
    <>
      <div
        className={["cm-chakra-watermark", revealed ? "is-revealed" : ""].filter(Boolean).join(" ")}
        aria-hidden
      >
        <Image
          src="/course-material/introduction-to-reiki/chakra-watermark.png"
          alt=""
          width={972}
          height={1378}
          className="cm-chakra-watermark-img"
          quality={100}
          unoptimized
          priority
        />
      </div>

      <button
        type="button"
        className="cm-chakra-watermark-toggle"
        aria-pressed={revealed}
        onClick={() => setRevealed((value) => !value)}
      >
        {revealed ? "Hide Image" : "Show Image"}
      </button>
    </>
  );
}
