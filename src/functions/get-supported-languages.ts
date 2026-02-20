export function getSupportedlanguages(): string[] {
  // expects a comma separated string like "GB,FR,ES,DE"
  const supportedLanguageString = process.env.NEXT_PUBLIC_SUPPORTED_LANGUAGES || 'GB';
  return supportedLanguageString.toUpperCase().split(',');
}
