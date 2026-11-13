import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';
import merge from 'deepmerge-json';
import { DEFAULT_LOCALE, isEnabledLocale, localeFromAcceptLanguage } from './locales';

export default getRequestConfig(async () => {
  // an explicit choice (language picker cookie) always wins; otherwise follow the browser language
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get('locale')?.value.toLowerCase();
  const locale = isEnabledLocale(cookieLocale) ? cookieLocale : (localeFromAcceptLanguage((await headers()).get('accept-language')) ?? DEFAULT_LOCALE);

  const msgGb = (await import(`../../messages/gb.json`)).default;
  const msgCustom = (await import(`../../messages/${locale}.json`)).default;
  const msgMerged = merge(msgGb, msgCustom);

  return {
    locale,
    messages: msgMerged,
  };
});
