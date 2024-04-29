import { UserType } from '../enums/user-type';

export function getPlaceholderForByUserType(userType: UserType): { firstName: string; username: string } {
  let placeholders = { firstName: 'Max', username: 'max' };

  if (userType === UserType.ASSOCIATION) placeholders = { firstName: 'WFFA', username: 'wffa' };
  if (userType === UserType.BRAND) placeholders = { firstName: 'PersianBall', username: 'persianball' };

  return placeholders;
}
