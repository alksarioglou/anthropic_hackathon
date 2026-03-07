"use client";

import { useCallback } from "react";
import translations, { type Locale, defaultLocale } from "./translations";
import { useLocale } from "./LocaleProvider";

type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object
        ? `${K}.${NestedKeyOf<T[K]>}`
        : K;
    }[keyof T & string]
  : never;

type TranslationKey = NestedKeyOf<(typeof translations)["en"]>;

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const value = path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object") {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
  return typeof value === "string" ? value : path;
}

export function useTranslation() {
  const locale = useLocale();

  const t = useCallback(
    (key: TranslationKey, params?: Record<string, string>) => {
      const dict =
        translations[locale as Locale] ?? translations[defaultLocale];
      let value = getNestedValue(dict as unknown as Record<string, unknown>, key);

      if (params) {
        Object.entries(params).forEach(([paramKey, paramValue]) => {
          value = value.replace(`{{${paramKey}}}`, paramValue);
        });
      }

      return value;
    },
    [locale]
  );

  return { t, locale };
}
