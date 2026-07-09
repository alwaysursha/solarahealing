"use client";

import { useEffect, useState } from "react";

export type CosmosProfile = "lite" | "full";

const TOUCH_QUERY = "(hover: none) and (pointer: coarse)";

function readProfile(): CosmosProfile {
  return window.matchMedia(TOUCH_QUERY).matches ? "lite" : "full";
}

/** Real touch devices (phones/tablets) get a lighter cosmic profile. */
export function useCosmosProfile(): CosmosProfile | null {
  const [profile, setProfile] = useState<CosmosProfile | null>(null);

  useEffect(() => {
    const query = window.matchMedia(TOUCH_QUERY);
    const update = () => setProfile(readProfile());
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return profile;
}
