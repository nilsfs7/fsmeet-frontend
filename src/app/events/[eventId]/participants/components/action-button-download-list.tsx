'use client';

import ActionButton from '@/components/common/ActionButton';
import { Action } from '@/domain/enums/action';
import { Event } from '@/types/event';
import { Toaster, toast } from 'sonner';
import moment from 'moment';
import { ConfigOptions, download, generateCsv, mkConfig } from 'export-to-csv';
import { AcceptedData } from 'export-to-csv/output/lib/types';
import { EventRegistration } from '@/types/event-registration';
import { Offering } from '@/types/offering';
import { Accommodation } from '@/types/accommodation';
import { getCountryNameByCode } from '@/functions/get-country-name-by-code';

interface IActionButtonDownloadList {
  event: Event;
  registrations: EventRegistration[];
  offerings: Offering[];
  accommodations: Accommodation[];
}

export const ActionButtonDownloadList = ({ event, registrations, offerings, accommodations }: IActionButtonDownloadList) => {
  const handleDownloadResultsClicked = async () => {
    const options: ConfigOptions = { filename: `${moment().format('YYYYMMDD HHmmss')} - ${event.name} -  registrations`, useKeysAsHeaders: true };
    const csvConfig = mkConfig(options);

    const data = mapRegistrationsToCsv(event, registrations, offerings, accommodations);
    if (data.length > 0) {
      const csvOutput = generateCsv(csvConfig)(data);
      download(csvConfig)(csvOutput);
    }
  };

  const mapRegistrationsToCsv = (
    event: Event,
    registrations: EventRegistration[],
    offerings: Offering[],
    accommodations: Accommodation[]
  ): { [k: string]: AcceptedData; [k: number]: AcceptedData }[] => {
    const na = '';
    const data: { [k: string]: AcceptedData; [k: number]: AcceptedData }[] = [];

    for (let i = 0; i < registrations.length; i++) {
      const registration = registrations[i];

      let competitionsCell: string = '';
      for (let i = 0; i < registration.competitionSignUps.length; i++) {
        event.competitions.forEach(comp => {
          if (comp.id === registration.competitionSignUps[i]) {
            competitionsCell = competitionsCell ? `${competitionsCell}, ${comp.name}` : comp.name;
          }
        });
      }

      let offeringsCell: string = '';
      for (let i = 0; i < registration.offeringOrders.length; i++) {
        offerings.forEach(off => {
          if (off.id === registration.offeringOrders[i]) {
            offeringsCell = offeringsCell ? `${offeringsCell}, ${off.description}` : off.description;
          }
        });
      }

      let accommodationsCell: string = '';
      for (let i = 0; i < registration.accommodationOrders.length; i++) {
        accommodations.forEach(acc => {
          if (acc.id === registration.accommodationOrders[i]) {
            accommodationsCell = accommodationsCell ? `${accommodationsCell}, ${acc.description}` : acc.description;
          }
        });
      }

      data.push({
        registration_type: registration.type,
        registration_status: registration.status,
        username: registration.user.username,
        first_name: registration.user.firstName,
        last_name: registration.user.lastName,
        gender: registration.user.gender,
        country_code: registration.user.country || na,
        country: registration.user.country ? getCountryNameByCode(registration.user.country) : na,
        t_shirt_size: registration.offeringTShirtSize || na,
        phone_country_code: registration.phoneCountryCode || na,
        phone_number: registration.phoneNumber || na,
        competitions: competitionsCell || na,
        offerings: offeringsCell || na,
        accommodations: accommodationsCell || na,
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
