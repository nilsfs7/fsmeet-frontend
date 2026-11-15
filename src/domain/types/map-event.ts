import { EventCategory } from '@/domain/enums/event-category';
import { EventType } from '@/domain/enums/event-type';

/** Trimmed event for the freestyler map (only the fields the pins and cards need). */
export type MapEvent = {
  id: string;
  alias: string | null;
  name: string;
  type: EventType;
  category: EventCategory;
  isWffaRanked: boolean;
  dateFrom: string;
  dateTo: string;
  registrationOpen: string;
  registrationDeadline: string;
  venueName: string;
  venueCity: string;
  venueCountryCode: string;
  lat: number;
  lng: number;
  imageUrlPoster: string | null;
};
