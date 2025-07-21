"use client";

import { AssetProvider } from "@/context/AssetContext";
import type { ReactNode } from "react";

export function AppProviders({ children }: { children: ReactNode }) {
  return <AssetProvider>{children}</AssetProvider>;
}
