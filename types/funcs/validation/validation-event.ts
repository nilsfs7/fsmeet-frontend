export function validateAlias(input: string): boolean {
  if (input.length <= 16) {
    const regexLowerAlphaNum: RegExp = /^[a-z0-9]+$/;
    if (input.length === 0 || regexLowerAlphaNum.test(input)) {
      return true;
    }
  }

  return false;
}
