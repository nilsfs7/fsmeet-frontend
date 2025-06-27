import { UserType } from '@/domain/enums/user-type';

export function isNaturalPerson(userType: UserType): boolean {
  if (userType === UserType.ASSOCIATION || userType === UserType.BRAND) {
    return false;
  }

  return true;
}
