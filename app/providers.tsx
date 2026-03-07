"use client";

import { useEffect } from "react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useAuth } from "@clerk/nextjs";
import { ThemeProvider } from "@/lib/ThemeProvider";
import { LocaleProvider } from "@/lib/i18n";
import type { ReactNode } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Suppress Clerk's dev-mode "You've created your first user!" floating notification
function ClerkDevSuppressor() {
  useEffect(() => {
    const suppress = (node: Node) => {
      if (node instanceof HTMLElement && node.textContent?.includes("You've created your first user")) {
        node.style.display = "none";
      }
    };
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          suppress(node);
          if (node instanceof HTMLElement) {
            node.querySelectorAll("*").forEach(suppress);
          }
        });
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    document.body.querySelectorAll("*").forEach(suppress);
    return () => observer.disconnect();
  }, []);
  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      <ThemeProvider>
        <LocaleProvider>
          <ClerkDevSuppressor />
          {children}
        </LocaleProvider>
      </ThemeProvider>
    </ConvexProviderWithClerk>
  );
}
