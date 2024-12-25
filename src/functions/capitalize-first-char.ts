export function capitalizeFirstChar(input: string): string {
  if (input.length > 0) {
    const firstChar = input.charAt(0).toUpperCase();
    input = firstChar + input.slice(1);
  }
  return input;
}
