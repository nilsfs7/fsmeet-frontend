import { UserType } from '@/domain/enums/user-type';
import { useTranslations } from 'next-intl';

export function getLabelForFirstName(userType: UserType): string {
  const t = useTranslations('/account');
  let label = t('tabGeneralFirstName');

  if (userType === UserType.ASSOCIATION) label = t('tabGeneralAssociationName');
  if (userType === UserType.BRAND) label = t('tabGeneralBrandName');

  return label;
}
