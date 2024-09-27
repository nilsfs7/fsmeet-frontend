import { UserType } from '../../domain/enums/user-type';

export function getLabelForFirstName(userType: UserType): string {
  let label = 'First Name';

  if (userType === UserType.ASSOCIATION) label = 'Association Name';
  if (userType === UserType.BRAND) label = 'Brand Name';

  return label;
}
