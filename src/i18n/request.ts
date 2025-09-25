import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';
import merge from 'deepmerge-json';

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get('locale');
  const locale = localeCookie?.value.toLowerCase() || 'gb';

  const msgGb = (await import(`../../messages/gb.json`)).default;
  const msgCustom = (await import(`../../messages/${locale}.json`)).default;
  const msgMerged = merge(msgGb, msgCustom);

  return {
    locale,
    messages: msgMerged,
  };
});
