export function validateFirstName(input: string): boolean {
  if (input.length <= 16) {
    const regexAlpha: RegExp = /^[a-zA-Z ]+$/;
    if (input.length === 0 || regexAlpha.test(input)) {
      return true;
    }
  }

  return false;
}
