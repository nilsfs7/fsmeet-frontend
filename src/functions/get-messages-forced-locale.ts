import merge from 'deepmerge-json';
import { isEnabledLocale } from '@/i18n/locales';

/**
 * Messages for an explicitly requested locale (e.g. `/map?iframe=1&locale=de`), merged over English like the
 * request config does. Imported (bundled) instead of read from `messages/` on disk, because the runtime image
 * only ships `.next`, not the source `messages/` folder. Unknown/disabled locales fall back to English.
 */
export async function getMessagesByLocale(locale: string) {
  const gb = (await import('../../messages/gb.json')).default;
  const lc = locale?.toLowerCase();
  if (!isEnabledLocale(lc) || lc === 'gb') return gb;
  try {
    const custom = (await import(`../../messages/${lc}.json`)).default;
    return merge(gb, custom);
  } catch {
    return gb;
  }
}
