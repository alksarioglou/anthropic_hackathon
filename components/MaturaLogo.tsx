"use client";

import Link from "next/link";
import { useTheme } from "@/lib/ThemeProvider";

export function MaturaLogo({ className, href = "/home" }: { className?: string; href?: string }) {
  const theme = useTheme();
  const src = theme === "dark" ? "/logo-light.svg" : "/logo-dark.svg";
  return (
    <Link href={href} className="shrink-0">
      <img src={src} alt="matura" className={className ?? "h-8"} />
    </Link>
  );
}
