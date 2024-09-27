import { imgAssociation, imgBrand, imgDJ, imgFreestyler, imgMC, imgMedia, imgTechnical } from '../consts/images';
import { UserType } from '../../domain/enums/user-type';

export function getUserTypeLabels(userType: UserType): string {
  switch (userType) {
    case UserType.ASSOCIATION:
      return 'Association';
    case UserType.BRAND:
      return 'Brand';
    case UserType.DJ:
      return 'DJ';
    case UserType.FREESTYLER:
      return 'Freestyler';
    case UserType.MC:
      return 'MC';
    case UserType.MEDIA:
      return 'Media';
    case UserType.TECHNICAL:
      return 'Technical';
  }
}

export function getUserTypeImages(userType: UserType): { path: string; size: number } {
  const defaultSize = 20;

  switch (userType) {
    case UserType.ASSOCIATION:
      return { path: imgAssociation, size: 30 };
    case UserType.BRAND:
      return { path: imgBrand, size: defaultSize };
    case UserType.DJ:
      return { path: imgDJ, size: defaultSize };
    case UserType.FREESTYLER:
      return { path: imgFreestyler, size: 30 };
    case UserType.MC:
      return { path: imgMC, size: defaultSize };
    case UserType.MEDIA:
      return { path: imgMedia, size: defaultSize };
    case UserType.TECHNICAL:
      return { path: imgTechnical, size: defaultSize };
  }
}
