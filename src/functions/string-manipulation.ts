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
  const titleCaseParts = lowerCaseParts.map((part) =>
    part
      .split('-')
      .map((subpart) => subpart.charAt(0).toUpperCase() + subpart.slice(1))
      .join('-'),
  );

  // return joined parts
  return titleCaseParts.join(' ');
}
