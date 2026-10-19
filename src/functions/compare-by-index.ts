export function compareByIndex<T extends { index?: number }>(a: T, b: T): number {
  if (a.index == null && b.index == null) return 0;
  if (a.index == null) return 1;
  if (b.index == null) return -1;
  return a.index - b.index;
}
