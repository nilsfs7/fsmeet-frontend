import { UserType } from '@/domain/enums/user-type';
import { imgAssociation, imgBrand, imgDJ, imgEventOrganizer, imgFreestyler, imgFreestylerFemale, imgMC, imgMedia, imgTechnical } from '@/domain/constants/images';
import { Gender } from '@/domain/enums/gender';

// todo: t -> translation
export function getUserTypeLabels(userType: UserType, t: any): string {
  switch (userType) {
    case UserType.ASSOCIATION:
      return 'Association';
    case UserType.BRAND:
      return 'Brand';
    case UserType.DJ:
      return 'DJ';
    case UserType.EVENT_ORGANIZER:
      return 'Event Organizer';
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

export function getUserTypeImages(userType: UserType, gender: string = Gender.MALE): { path: string; size: number } {
  const defaultSize = 20;

  switch (userType) {
    case UserType.ASSOCIATION:
      return { path: imgAssociation, size: 30 };
    case UserType.BRAND:
      return { path: imgBrand, size: defaultSize };
    case UserType.DJ:
      return { path: imgDJ, size: defaultSize };
    case UserType.EVENT_ORGANIZER:
      return { path: imgEventOrganizer, size: defaultSize };
    case UserType.FREESTYLER:
      if (gender === Gender.FEMALE) {
        return { path: imgFreestylerFemale, size: 30 };
      } else {
        return { path: imgFreestyler, size: 30 };
      }
    case UserType.MC:
      return { path: imgMC, size: defaultSize };
    case UserType.MEDIA:
      return { path: imgMedia, size: defaultSize };
    case UserType.TECHNICAL:
      return { path: imgTechnical, size: defaultSize };
  }
}
