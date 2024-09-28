import { UserType } from '@/domain/enums/user-type';

export function getPlaceholderByUserType(userType: UserType): { firstName: string; username: string; email: string } {
  let placeholders = { firstName: 'Max', username: 'max', email: 'max@gmail.com' };

  if (userType === UserType.ASSOCIATION) placeholders = { firstName: 'WFFA', username: 'wffa', email: 'info@thewffa.com' };
  if (userType === UserType.BRAND) placeholders = { firstName: 'BLR', username: 'blr', email: 'shop@blr.com' };

  return placeholders;
}
