'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import UserSection from '@/components/events/user-section';
import { AttendeeFilters, AttendeeFiltersNoMatch, FILTER_ALL, optionsFromValues, useCountryName, userMatchesSearch } from '@/components/events/attendee-filters';
import { User } from '@/domain/types/user';
import { Gender } from '@/domain/enums/gender';

interface ParticipantsPanelProps {
  title: string;
  users: User[];
  showUserCountryFlag: boolean;
}

/** Participants tab of the competition page: filter toolbar + participant list. */
export function ParticipantsPanel({ title, users, showUserCountryFlag }: ParticipantsPanelProps) {
  const tf = useTranslations('global/components/attendee-filters');
  const countryName = useCountryName();

  const [search, setSearch] = useState('');
  const [gender, setGender] = useState(FILTER_ALL);
  const [country, setCountry] = useState(FILTER_ALL);

  const genderLabel = (value: string) => (value === Gender.MALE ? tf('genderMale') : value === Gender.FEMALE ? tf('genderFemale') : value);

  const shownUsers = users.filter(user => {
    if (!userMatchesSearch(user, search)) return false;
    if (gender !== FILTER_ALL && user.gender !== gender) return false;
    if (country !== FILTER_ALL && user.countryCode !== country) return false;
    return true;
  });

  const reset = () => {
    setSearch('');
    setGender(FILTER_ALL);
    setCountry(FILTER_ALL);
  };

  return (
    <div className="flex flex-col gap-3 pb-4">
      <AttendeeFilters
        search={search}
        onSearchChange={setSearch}
        shown={shownUsers.length}
        total={users.length}
        onReset={reset}
        filters={[
          {
            id: 'gender',
            label: tf('gender'),
            value: gender,
            onChange: setGender,
            options: optionsFromValues(
              users.map(u => u.gender),
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
                    users.map(u => u.countryCode),
                    countryName,
                  ),
                },
              ]
            : []),
        ]}
      />

      {shownUsers.length === 0 ? <AttendeeFiltersNoMatch /> : <UserSection sectionTitle={`${title} · ${shownUsers.length}`} showUserCountryFlag={showUserCountryFlag} users={shownUsers} />}
    </div>
  );
}
