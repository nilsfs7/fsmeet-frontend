'use client';

import ActionButton from '@/components/common/ActionButton';
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
        registration_type: registration.type,
        registration_status: registration.status,
        username: registration.user.username,
        wffa_id: registration.user.wffaId || na,
        first_name: registration.user.firstName,
        last_name: registration.user.lastName,
        nickname: registration.user.nickName || na,
        gender: registration.user.gender,
        country_code: registration.user.country || na,
        country: registration.user.country ? getCountryNameByCode(registration.user.country) : na,
        t_shirt_size: registration.offeringTShirtSize || na,
        phone_country_code: registration.phoneCountryCode || na,
        phone_number: registration.phoneNumber || na,
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
