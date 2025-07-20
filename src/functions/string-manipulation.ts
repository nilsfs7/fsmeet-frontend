/**
 * Converts a name string to title case.
 * Capitalizes the first letter of each word and sub-word (e.g., hyphenated names).
 * Handles both spaces and hyphens. Non-Latin scripts (like Japanese) are left unchanged.
 *
 * @param input - The text to convert (e.g., "john doe-smith")
 * @returns The title-cased version of the name (e.g., "John Doe-Smith")
 */
export function toTitleCase(input: string): string {
  // split by space
  const lowerCaseParts = input.toLowerCase().split(' ');

  // split by hyphon, modify case and join
  const titleCaseParts = lowerCaseParts.map(part =>
    part
      .split('-')
      .map(subpart => subpart.charAt(0).toUpperCase() + subpart.slice(1))
      .join('-')
  );

  // return joined parts
  return titleCaseParts.join(' ');
}

export function getFilenameFromUrl(url: string): string {
  return url.split('/').pop() || '';
}

export function truncateString(filename: string, amountStartingChars: number, amountEndingChars: number, replaceChars = '...'): string {
  if (filename.length <= amountStartingChars + replaceChars.length + amountEndingChars) return filename;
  const first = filename.slice(0, amountStartingChars);
  const last = filename.slice(0 - amountEndingChars);
  return `${first}${replaceChars}${last}`;
}
