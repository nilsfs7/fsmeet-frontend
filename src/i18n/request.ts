import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export default getRequestConfig(async () => {
  const localeCokie = cookies().get('locale');
  const locale = localeCokie?.value.toLowerCase() || 'gb';

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
