'use client';

import ActionButton from '@/components/common/action-button';
import { Action } from '@/domain/enums/action';
import { Event } from '@/domain/types/event';
import { Toaster, toast } from 'sonner';
import moment from 'moment';
import { ConfigOptions, download, generateCsv, mkConfig } from 'export-to-csv';
import { AcceptedData } from 'export-to-csv/output/lib/types';
import { EventRegistration } from '@/domain/types/event-registration';
import { Offering } from '@/domain/types/offering';
import { Accommodation } from '@/domain/types/accommodation';
import { getCountryNameByCode } from '@/functions/get-country-name-by-code';
import { Competition } from '@/domain/types/competition';

interface IActionButtonDownloadList {
  event: Event;
  competitions: Competition[];
  registrations: EventRegistration[];
  offerings: Offering[];
  accommodations: Accommodation[];
}

export const ActionButtonDownloadList = ({ event, competitions, registrations, offerings, accommodations }: IActionButtonDownloadList) => {
  const handleDownloadResultsClicked = async () => {
    const options: ConfigOptions = { filename: `${moment().format('YYYYMMDD HHmmss')} - ${event.name} -  registrations`, useKeysAsHeaders: true };
    const csvConfig = mkConfig(options);

    const data = mapRegistrationsToCsv(registrations, offerings, accommodations);
    if (data.length > 0) {
      const csvOutput = generateCsv(csvConfig)(data);
      download(csvConfig)(csvOutput);
    }
  };

  const mapRegistrationsToCsv = (registrations: EventRegistration[], offerings: Offering[], accommodations: Accommodation[]): { [k: string]: AcceptedData; [k: number]: AcceptedData }[] => {
    const na = '';
    const data: { [k: string]: AcceptedData; [k: number]: AcceptedData }[] = [];

    for (let i = 0; i < registrations.length; i++) {
      const registration = registrations[i];

      const competitionsData = competitions.reduce(
        (acc, value) => {
          let cellValue: string = na;

          if (value.id) {
            if (registration.competitionSignUps.includes(value.id)) {
              cellValue = `x`;
            }
          }

          acc[value.name] = cellValue;
          return acc;
        },
        {} as Record<string, string>
      );

      const offeringsData = offerings.reduce(
        (acc, value) => {
          let cellValue: string = na;

          if (value.id) {
            if (registration.offeringOrders.includes(value.id)) {
              cellValue = `x`;
            }
          }

          acc[value.description] = cellValue;
          return acc;
        },
        {} as Record<string, string>
      );

      const accommodationsData = accommodations.reduce(
        (acc, value) => {
          let cellValue: string = na;

          if (value.id) {
            if (registration.accommodationOrders.includes(value.id)) {
              cellValue = `x`;
            }
          }

          acc[value.description] = cellValue;
          return acc;
        },
        {} as Record<string, string>
      );

      data.push({
        'Registration Type': registration.type,
        'Registration Status': registration.status,
        Username: registration.user.username,
        'WFFA ID': registration.user.wffaId || na,
        'First Name': registration.user.firstName,
        'Last Name': registration.user.lastName,
        Nickname: registration.user.nickName || na,
        Gender: registration.user.gender,
        'Country Code': registration.user.country || na,
        Country: registration.user.country ? getCountryNameByCode(registration.user.country) : na,
        'T-Shirt Size': registration.offeringTShirtSize || na,
        'Phone Country Code': registration.phoneCountryCode || na,
        'Phone Number': registration.phoneNumber || na,
        ...competitionsData,
        ...offeringsData,
        ...accommodationsData,
      });
    }

    return data;
  };

  return (
    <>
      <Toaster richColors />

      {registrations.length > 0 && <ActionButton action={Action.DOWNLOAD} onClick={handleDownloadResultsClicked} />}
    </>
  );
};
