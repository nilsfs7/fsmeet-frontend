export function useMessagesForcedLocale(locale: string) {
  try {
    const forcedMessages = require(`../../messages/${locale}.json`);
    return forcedMessages;
  } catch {
    return {};
  }
}
