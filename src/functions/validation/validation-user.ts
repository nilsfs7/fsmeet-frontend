export const FIRST_NAME_MAX_LENGTH = 16;

export function validateFirstName(input: string): boolean {
  if (input.length <= FIRST_NAME_MAX_LENGTH) {
    const regexAlpha: RegExp = /^[a-zA-Z ]+$/;
    if (input.length === 0 || regexAlpha.test(input)) {
      return true;
    }
  }

  return false;
}
