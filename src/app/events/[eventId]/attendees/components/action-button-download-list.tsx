'use client';

import ActionButton from '@/components/common/action-button';
import { Action } from '@/domain/enums/action';
import { Event } from '@/domain/types/event';
import { Toaster } from 'sonner';
import moment from 'moment';
import { ConfigOptions, download, generateCsv, mkConfig } from 'export-to-csv';
import { AcceptedData } from 'export-to-csv/output/lib/types';
import { EventRegistration } from '@/domain/types/event-registration';
import { Offering } from '@/domain/types/offering';
import { Accommodation } from '@/domain/types/accommodation';
import { getCountryNameByCode } from '@/functions/get-country-name-by-code';
import { Competition } from '@/domain/types/competition';
import { getShortDateString } from '../../../../../functions/time';

const CSV_EMPTY = '';
const CSV_MARK = 'x';

type CsvRow = Record<string, AcceptedData>;

/** One column per item: "x" when `item.id` is in `selectedIds`, else empty. */
function markSelectedColumns<T extends { id?: string }>(
  items: T[],
  selectedIds: readonly string[],
  columnKey: (item: T) => string,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const item of items) {
    out[columnKey(item)] = item.id && selectedIds.includes(item.id) ? CSV_MARK : CSV_EMPTY;
  }
  return out;
}

function mapRegistrationsToCsv(
  competitions: Competition[],
  registrations: EventRegistration[],
  offerings: Offering[],
  accommodations: Accommodation[],
): CsvRow[] {
  return registrations.map((registration) => {
    const { user } = registration;
    const code = user.countryCode;

    return {
      'Registration Date': `${moment(registration?.date).format('YYYY-MM-DD HH:mm')}`,
      'Registration Type': registration.type,
      'Registration Status': registration.status,
      Username: user.username,
      'WFFA ID': user.wffaId || CSV_EMPTY,
      'First Name': user.firstName,
      'Last Name': user.lastName,
      Nickname: user.nickName || CSV_EMPTY,
      Gender: user.gender,
      'Country Code': user.countryCode || CSV_EMPTY,
      Country: code ? getCountryNameByCode(code) : CSV_EMPTY,
      'T-Shirt Size': registration.offeringTShirtSize || CSV_EMPTY,
      'Phone Country Code': registration.phoneCountryCode || CSV_EMPTY,
      'Phone Number': registration.phoneNumber || CSV_EMPTY,
      'Arrival Date': registration.arrivalDate ? getShortDateString(moment(registration.arrivalDate)) : CSV_EMPTY,
      'Departure Date': registration.departureDate ? getShortDateString(moment(registration.departureDate)) : CSV_EMPTY,
      ...markSelectedColumns(competitions, registration.competitionSignUps, (c) => c.name),
      ...markSelectedColumns(offerings, registration.offeringOrders, (o) => o.description),
      ...markSelectedColumns(accommodations, registration.accommodationOrders, (a) => a.description),
    };
  });
}

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

    const data = mapRegistrationsToCsv(competitions, registrations, offerings, accommodations);
    if (data.length > 0) {
      const csvOutput = generateCsv(csvConfig)(data);
      download(csvConfig)(csvOutput);
    }
  };

  return (
    <>
      <Toaster richColors />

      {registrations.length > 0 && <ActionButton action={Action.DOWNLOAD} onClick={handleDownloadResultsClicked} />}
    </>
  );
};
