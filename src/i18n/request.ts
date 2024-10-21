import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';
import merge from 'deepmerge-json';

export default getRequestConfig(async () => {
  const localeCokie = cookies().get('locale');
  const locale = localeCokie?.value.toLowerCase() || 'gb';

  const msgGb = (await import(`../../messages/gb.json`)).default;
  const msgCustom = (await import(`../../messages/${locale}.json`)).default;
  const msgMerged = merge(msgGb, msgCustom);

  return {
    locale,
    messages: msgMerged,
  };
});
