'use client';

import { UserType } from '@/domain/enums/user-type';

export function getLabelForFirstName(userType: UserType, t: any): string {
  let label = t('tabGeneralFirstName');

  if (userType === UserType.ASSOCIATION) label = t('tabGeneralAssociationName');
  if (userType === UserType.BRAND) label = t('tabGeneralBrandName');

  return label;
}
