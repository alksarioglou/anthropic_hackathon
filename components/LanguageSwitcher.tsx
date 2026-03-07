"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale, useSetLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

const LANGUAGES: { code: Locale; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "GB" },
  { code: "de", label: "Deutsch", flag: "DE" },
  { code: "fr", label: "Francais", flag: "FR" },
];

function FlagIcon({ country }: { country: string }) {
  const codePoints = [...country.toUpperCase()].map(
    (c) => 0x1f1e6 - 65 + c.charCodeAt(0)
  );
  return <span>{String.fromCodePoint(...codePoints)}</span>;
}

export function LanguageSwitcher() {
  const locale = useLocale();
  const setLocale = useSetLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const current = LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES[0];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground-secondary hover:text-foreground hover:border-foreground-muted transition-colors"
      >
        <FlagIcon country={current.flag} />
        {current.code.toUpperCase()}
        <svg className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 5l3 3 3-3" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 min-w-[140px] rounded-xl border border-border bg-background shadow-lg py-1">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => { setLocale(lang.code); setOpen(false); }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                locale === lang.code
                  ? "text-primary font-medium bg-primary/5"
                  : "text-foreground-secondary hover:text-foreground hover:bg-card-bg"
              }`}
            >
              <FlagIcon country={lang.flag} />
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
