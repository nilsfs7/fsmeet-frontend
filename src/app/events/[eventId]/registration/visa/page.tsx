'use client';

import { useEffect, useState } from 'react';
import TextButton from '@/components/common/TextButton';
import { routeHome, routeLogin } from '@/domain/constants/routes';
import Navigation from '@/components/Navigation';
import ActionButton from '@/components/common/ActionButton';
import Link from 'next/link';
import { Action } from '@/domain/enums/action';
import PageTitle from '@/components/PageTitle';
import { Toaster, toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { createVisaInvitationRequest } from '@/infrastructure/clients/event.client';
import TextInput from '@/components/common/TextInput';
import { DatePicker } from '@/components/common/DatePicker';
import moment, { Moment } from 'moment';
import ComboBox from '@/components/common/ComboBox';
import { menuCountries } from '@/domain/constants/menus/menu-countries';
import { getUser } from '@/infrastructure/clients/user.client';
import { User } from '@/domain/types/user';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { toTitleCase } from '@/functions/string-manipulation';

export default function VisaInvitationRequest({ params }: { params: { eventId: string } }) {
  const t = useTranslations('/events/eventid/registration/visa');

  const { data: session } = useSession();

  const router = useRouter();

  const [user, setUser] = useState<User>();

  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [passportNumber, setPassportNumber] = useState<string>('');
  const [birthday, setBirthday] = useState<string>('');

  const loginRouteWithCallbackUrl = `${routeLogin}?callbackUrl=${window.location}`;

  const checkInputs = (): boolean => {
    let valid = true;

    if (firstName === '') {
      valid = false;
    }

    if (lastName === '') {
      valid = false;
    }

    if (country === '') {
      valid = false;
    }

    if (passportNumber === '') {
      valid = false;
    }

    if (birthday === '') {
      valid = false;
    }

    return valid;
  };

  const handleFirstNameChanged = (value: string) => {
    if (value) {
      setFirstName(toTitleCase(value));
    }
  };

  const handleLastNameChanged = (value: string) => {
    if (value) {
      setLastName(toTitleCase(value));
    }
  };

  const handlePassportNumberChanged = (value: string) => {
    if (value) {
      setPassportNumber(value.toUpperCase());
    }
  };

  const handleBirthdayChanged = (value: Moment) => {
    if (value) {
      setBirthday(value.startOf('day').utc().format());
    }
  };

  const handleSendClicked = async () => {
    try {
      if (checkInputs()) {
        await createVisaInvitationRequest(params.eventId, firstName, lastName, country, passportNumber, session);
        router.push(`${window.location}/success`);
      }
    } catch (error: any) {
      toast.error(error.message);
      console.error(error.message);
    }
  };

  useEffect(() => {
    if (session) {
      getUser(session?.user.username, session).then((user: User) => {
        setUser(user);

        setFirstName(user?.firstName ? user.firstName : '');
        setLastName(user?.lastName ? user.lastName : '');
        setCountry(user?.country ? user.country : '');
        setPassportNumber('');
        setBirthday(user?.birthday ? user.birthday : '');
      });
    }
  }, [session]);

  if (!user) {
    return (
      <div className={'absolute inset-0 flex flex-col'}>
        <div className="h-full flex flex-col justify-center">
          <div className="flex flex-col items-center gap-2">
            <div>{t('textUnauthorized')}</div>
            <Link href={loginRouteWithCallbackUrl}>
              <TextButton text={t('btnGoToLogin')} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster richColors />

      <div className={'absolute inset-0 flex flex-col'}>
        <Header />

        <PageTitle title={t('pageTitle')} />

        <div className="h-full flex flex-col items-center justify-center">
          <div className="m-2 flex flex-col rounded-lg bg-secondary-light p-1">
            <TextInput
              id={'firstName'}
              label={t('inputFirstName')}
              value={firstName}
              placeholder={t('inputPlaceholderFirstName')}
              onChange={e => {
                handleFirstNameChanged(e.currentTarget.value);
              }}
            />

            <TextInput
              id={'lastName'}
              label={t('inputLastName')}
              value={lastName}
              placeholder={t('inputPlaceholderLastName')}
              onChange={e => {
                handleLastNameChanged(e.currentTarget.value);
              }}
            />

            <div className="m-2 items-center">
              <div>{t('inputCountry')}</div>
              <div className="flex w-full">
                <ComboBox
                  menus={menuCountries}
                  value={country ? country : ''}
                  searchEnabled={true}
                  onChange={(value: any) => {
                    setCountry(value);
                  }}
                />
              </div>
            </div>

            <TextInput
              id={'passportNumber'}
              label={t('inputPassportNumber')}
              value={passportNumber}
              placeholder={t('inputPlaceholderPassportNumber')}
              onChange={e => {
                handlePassportNumberChanged(e.currentTarget.value);
              }}
            />

            <div className="m-2 items-center">
              <div>{t('datePickerBirthday')}</div>
              <DatePicker
                date={moment(birthday)}
                fromDate={moment(1970)}
                toDate={moment().subtract(6, 'y')}
                onChange={value => {
                  handleBirthdayChanged(value);
                }}
              />
            </div>
          </div>

          <div className="flex justify-center py-2">
            <TextButton text={t('btnSendRequest')} disabled={!checkInputs()} onClick={handleSendClicked} />
          </div>
        </div>

        <Navigation>
          <Link href={routeHome}>
            <ActionButton action={Action.BACK} />
          </Link>
        </Navigation>
      </div>
    </>
  );
}
