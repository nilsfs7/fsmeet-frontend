'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import UserSection from '@/components/events/user-section';
import { AttendeeFilters, AttendeeFiltersNoMatch, FILTER_ALL, optionsFromValues, useCountryName, userMatchesSearch } from '@/components/events/attendee-filters';
import { EventRegistration } from '@/domain/types/event-registration';
import { EventRegistrationType } from '@/domain/types/event-registration-type';
import { EventRegistrationStatus } from '@/domain/enums/event-registration-status';
import { Competition } from '@/domain/types/competition';
import { Gender } from '@/domain/enums/gender';

const NO_COMPETITION = '__none__';

interface RegistrationsPanelProps {
  participantRegistrations: EventRegistration[];
  visitorRegistrations: EventRegistration[];
  competitions: Competition[];
  showUserCountryFlag: boolean;
}

/** Registrations tab of the event page: filter toolbar + participant / visitor sections. */
export function RegistrationsPanel({ participantRegistrations, visitorRegistrations, competitions, showUserCountryFlag }: RegistrationsPanelProps) {
  const t = useTranslations('/events/eventid');
  const tf = useTranslations('global/components/attendee-filters');
  const countryName = useCountryName();

  const [search, setSearch] = useState('');
  const [type, setType] = useState(FILTER_ALL);
  const [status, setStatus] = useState(FILTER_ALL);
  const [gender, setGender] = useState(FILTER_ALL);
  const [country, setCountry] = useState(FILTER_ALL);
  const [competition, setCompetition] = useState(FILTER_ALL);

  const all = useMemo(() => [...participantRegistrations, ...visitorRegistrations], [participantRegistrations, visitorRegistrations]);

  const statusLabel = (value: string) => (value === EventRegistrationStatus.APPROVED ? tf('statusApproved') : value === EventRegistrationStatus.PENDING ? tf('statusPending') : value);
  const genderLabel = (value: string) => (value === Gender.MALE ? tf('genderMale') : value === Gender.FEMALE ? tf('genderFemale') : value);

  const competitionOptions = useMemo(() => {
    if (competitions.length === 0 || participantRegistrations.length === 0) return [];
    const options = competitions
      .filter(c => c.id)
      .map(c => ({ value: c.id as string, label: c.name, count: participantRegistrations.filter(r => r.competitionSignUps?.includes(c.id as string)).length }));
    const none = participantRegistrations.filter(r => !r.competitionSignUps || r.competitionSignUps.length === 0).length;
    return none > 0 ? [...options, { value: NO_COMPETITION, label: tf('competitionNone'), count: none }] : options;
  }, [competitions, participantRegistrations, tf]);

  const matches = (registration: EventRegistration) => {
    if (!userMatchesSearch(registration.user, search)) return false;
    if (type !== FILTER_ALL && registration.type !== type) return false;
    if (status !== FILTER_ALL && registration.status !== status) return false;
    if (gender !== FILTER_ALL && registration.user.gender !== gender) return false;
    if (country !== FILTER_ALL && registration.user.countryCode !== country) return false;
    if (competition !== FILTER_ALL) {
      if (registration.type !== EventRegistrationType.PARTICIPANT) return false;
      const signUps = registration.competitionSignUps ?? [];
      if (competition === NO_COMPETITION ? signUps.length > 0 : !signUps.includes(competition)) return false;
    }
    return true;
  };

  const participants = participantRegistrations.filter(matches);
  const visitors = visitorRegistrations.filter(matches);
  const shown = participants.length + visitors.length;

  const reset = () => {
    setSearch('');
    setType(FILTER_ALL);
    setStatus(FILTER_ALL);
    setGender(FILTER_ALL);
    setCountry(FILTER_ALL);
    setCompetition(FILTER_ALL);
  };

  return (
    <div className="flex flex-col gap-3">
      <AttendeeFilters
        search={search}
        onSearchChange={setSearch}
        shown={shown}
        total={all.length}
        onReset={reset}
        filters={[
          {
            id: 'type',
            label: tf('type'),
            value: type,
            onChange: setType,
            options: [
              ...(participantRegistrations.length > 0 ? [{ value: EventRegistrationType.PARTICIPANT, label: tf('typeParticipants'), count: participantRegistrations.length }] : []),
              ...(visitorRegistrations.length > 0 ? [{ value: EventRegistrationType.VISITOR, label: tf('typeVisitors'), count: visitorRegistrations.length }] : []),
            ],
          },
          {
            id: 'status',
            label: tf('status'),
            value: status,
            onChange: setStatus,
            options: optionsFromValues(
              all.map(r => r.status),
              statusLabel,
            ),
          },
          { id: 'competition', label: tf('competition'), value: competition, onChange: setCompetition, options: competitionOptions },
          {
            id: 'gender',
            label: tf('gender'),
            value: gender,
            onChange: setGender,
            options: optionsFromValues(
              all.map(r => r.user.gender),
              genderLabel,
            ),
          },
          ...(showUserCountryFlag
            ? [
                {
                  id: 'country',
                  label: tf('country'),
                  value: country,
                  onChange: setCountry,
                  options: optionsFromValues(
                    all.map(r => r.user.countryCode),
                    countryName,
                  ),
                },
              ]
            : []),
        ]}
      />

      {shown === 0 && <AttendeeFiltersNoMatch />}

      {participants.length > 0 && (
        <UserSection
          sectionTitle={`${t('tabRegistrationsSectionRegistrationParticipants')} · ${participants.length}`}
          users={participants.map(r => r.user)}
          showUserCountryFlag={showUserCountryFlag}
          registrationStatus={participants.map(r => r.status)}
        />
      )}

      {visitors.length > 0 && (
        <UserSection
          sectionTitle={`${t('tabRegistrationsSectionRegistrationVisitors')} · ${visitors.length}`}
          users={visitors.map(r => r.user)}
          showUserCountryFlag={showUserCountryFlag}
          registrationStatus={visitors.map(r => r.status)}
        />
      )}
    </div>
  );
}
