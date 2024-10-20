'use client';

import { UserType } from '@/domain/enums/user-type';

export function getLabelForFirstName(userType: UserType, t: any): string {
  let label = t('firstName');

  if (userType === UserType.ASSOCIATION) label = t('associationName');
  if (userType === UserType.BRAND) label = t('brandName');

  return label;
}
