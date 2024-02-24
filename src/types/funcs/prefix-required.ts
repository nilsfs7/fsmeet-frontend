export function prefixRequired(value: string, prefix: string, trim: boolean = true): string {
  if (trim) {
    value = value.trim();
  }

  if (value && !value.startsWith(prefix)) {
    return `${prefix}${value}`;
  }

  return value;
}
