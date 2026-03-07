"use client";

import { useTheme } from "@/lib/ThemeProvider";

export function MaturaLogo({ className }: { className?: string }) {
  const theme = useTheme();
  const src = theme === "dark" ? "/logo-light.svg" : "/logo-dark.svg";
  return <img src={src} alt="matura" className={className ?? "h-8"} />;
}
