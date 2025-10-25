import { UserType } from '@/domain/enums/user-type';
import {
  imgAssociation,
  imgBrand,
  imgDJ,
  imgEventOrganizer,
  imgFan,
  imgFreestyler,
  imgFreestylerFemale,
  imgMC,
  imgMedia,
  imgAdministrative,
  imgFreestylerPng,
  imgMCPng,
  imgMediaPng,
  imgAdministrativePng,
  imgFreestylerFemalePng,
  imgFanPng,
  imgEventOrganizerPng,
  imgDJPng,
  imgBrandPng,
  imgAssociationPng,
} from '@/domain/constants/images';
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
    case UserType.FAN:
      return 'Fan';
    case UserType.FREESTYLER:
      return 'Freestyler';
    case UserType.MC:
      return 'MC';
    case UserType.MEDIA:
      return 'Media';
    case UserType.ADMINISTRATIVE:
      return 'Administrative';
  }
}

export function getUserTypeImages(userType: UserType, gender: string = Gender.MALE, png = false): { path: string; size: number } {
  const defaultSize = 20;
  let size = defaultSize;
  let path = 'unknown';

  switch (userType) {
    case UserType.ASSOCIATION:
      size = 30;
      path = png ? imgAssociationPng : imgAssociation;
      break;
    case UserType.BRAND:
      path = png ? imgBrandPng : imgBrand;
      break;
    case UserType.DJ:
      path = png ? imgDJPng : imgDJ;
      break;
    case UserType.EVENT_ORGANIZER:
      path = png ? imgEventOrganizerPng : imgEventOrganizer;
      break;
    case UserType.FAN:
      path = png ? imgFanPng : imgFan;
      break;
    case UserType.FREESTYLER:
      size = 30;
      if (gender === Gender.FEMALE) {
        path = png ? imgFreestylerFemalePng : imgFreestylerFemale;
      } else {
        path = png ? imgFreestylerPng : imgFreestyler;
      }
      break;
    case UserType.MC:
      path = png ? imgMCPng : imgMC;
      break;
    case UserType.MEDIA:
      path = png ? imgMediaPng : imgMedia;
      break;
    case UserType.ADMINISTRATIVE:
      path = png ? imgAdministrativePng : imgAdministrative;
      break;
  }

  return { path, size };
}
