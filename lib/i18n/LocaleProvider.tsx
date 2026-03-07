"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { type Locale, defaultLocale } from "./translations";

const LocaleContext = createContext<Locale>(defaultLocale);
const SetLocaleContext = createContext<(locale: Locale) => void>(() => {});

export function LocaleProvider({
  children,
  initialLocale = defaultLocale,
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocale] = useState<Locale>(initialLocale);

  return (
    <LocaleContext.Provider value={locale}>
      <SetLocaleContext.Provider value={setLocale}>
        {children}
      </SetLocaleContext.Provider>
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}

export function useSetLocale() {
  return useContext(SetLocaleContext);
}
