import { getSupportedlanguages } from '@/functions/get-supported-languages';

/** App locale codes (country-style, matching /messages/<code>.json) per primary language subtag. */
const LANGUAGE_TO_LOCALE: Record<string, string> = {
  en: 'gb',
  de: 'de',
  fr: 'fr',
  es: 'es',
  ja: 'jp',
  zh: 'cn',
  ar: 'sa',
  hi: 'in',
  ms: 'my',
};

/** BCP 47 language for <html lang> per app locale. */
const LOCALE_TO_HTML_LANG: Record<string, string> = Object.fromEntries(Object.entries(LANGUAGE_TO_LOCALE).map(([lang, locale]) => [locale, lang]));

export const DEFAULT_LOCALE = 'gb';

/** Locales that are both enabled (NEXT_PUBLIC_SUPPORTED_LANGUAGES) and have a messages file. */
export function getEnabledLocales(): string[] {
  const known = new Set(Object.values(LANGUAGE_TO_LOCALE));
  return getSupportedlanguages()
    .map(l => l.trim().toLowerCase())
    .filter(l => known.has(l));
}

export function isEnabledLocale(locale: string | undefined | null): locale is string {
  return !!locale && getEnabledLocales().includes(locale.toLowerCase());
}

/** Picks the best enabled locale from an Accept-Language header (q-weights, then order), or undefined. */
export function localeFromAcceptLanguage(header: string | null | undefined): string | undefined {
  if (!header) return undefined;
  const enabled = getEnabledLocales();
  const ranges = header
    .split(',')
    .map((part, index) => {
      const [tag, ...params] = part.trim().split(';');
      const qParam = params.find(p => p.trim().startsWith('q='));
      const q = qParam ? Number(qParam.trim().slice(2)) : 1;
      return { tag: tag.trim().toLowerCase(), q: Number.isFinite(q) ? q : 0, index };
    })
    .filter(r => r.tag && r.tag !== '*' && r.q > 0)
    .sort((a, b) => b.q - a.q || a.index - b.index);

  for (const { tag } of ranges) {
    const locale = LANGUAGE_TO_LOCALE[tag.split('-')[0]];
    if (locale && enabled.includes(locale)) return locale;
  }
  return undefined;
}

export function htmlLangForLocale(locale: string): string {
  return LOCALE_TO_HTML_LANG[locale.toLowerCase()] ?? 'en';
}
