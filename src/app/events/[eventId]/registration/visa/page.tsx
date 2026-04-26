'use client';

import { use, useEffect, useState, type ReactNode } from 'react';
import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import { routeHome, routeLogin } from '@/domain/constants/routes';
import Navigation from '@/components/navigation';
import ActionButton from '@/components/common/action-button';
import Link from 'next/link';
import { Action } from '@/domain/enums/action';
import PageTitle from '@/components/page-title';
import { Toaster, toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { createVisaInvitationRequest } from '@/infrastructure/clients/event.client';
import TextInput from '@/components/common/text-input';
import { DatePicker } from '@/components/common/date-picker';
import moment, { Moment } from 'moment';
import ComboBox from '@/components/common/combo-box';
import { menuCountries } from '@/domain/constants/menus/menu-countries';
import { getUser } from '@/infrastructure/clients/user.client';
import { User } from '@/domain/types/user';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { toTitleCase } from '@/functions/string-manipulation';
import { cn } from '@/lib/utils';

/** @see `competition-editor.tsx` `EDITOR_CARD_CLASS` */
const EDITOR_CARD_CLASS = cn(
  'flex w-full max-w-2xl min-w-0 flex-col overflow-y-auto scrollbar-none',
  'gap-3 rounded-xl border border-border/60 bg-secondary-light/85 p-2.5 shadow-xs backdrop-blur-sm',
  'supports-[backdrop-filter]:bg-secondary-light/70',
  'dark:border-border/50 dark:bg-background/60 dark:supports-[backdrop-filter]:bg-background/50',
);
const FIELD_ROW_CLASS =
  'grid min-w-0 grid-cols-[minmax(0,1fr),minmax(0,1.5fr)] items-center gap-x-3 gap-y-1';
const FIELD_LABEL_CLASS = 'min-w-0 text-sm font-medium leading-none';
const FIELD_CONTROL_CLASS = 'min-w-0 w-full';

function FieldRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={FIELD_ROW_CLASS}>
      <div className={FIELD_LABEL_CLASS}>{label}</div>
      <div className={FIELD_CONTROL_CLASS}>{children}</div>
    </div>
  );
}

const visaMainScrollClass = 'min-h-0 min-w-0 flex-1 overflow-y-auto';
const visaContentColumnClass = cn('mx-auto w-full min-w-0 max-w-content', 'px-4 py-4 sm:px-6 md:px-8');

export default function VisaInvitationRequest(props: { params: Promise<{ eventId: string }> }) {
  const params = use(props.params);
  const t = useTranslations('/events/eventid/registration/visa');

  const { data: session } = useSession();

  const router = useRouter();

  const [user, setUser] = useState<User>();

  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [countryCode, setCountryCode] = useState<string>('');
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

    if (countryCode === '') {
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
        await createVisaInvitationRequest(params.eventId, firstName, lastName, countryCode, passportNumber, session);
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
        setCountryCode(user?.countryCode ? user.countryCode : '');
        setPassportNumber('');
        setBirthday(user?.birthday ? user.birthday : '');
      });
    }
  }, [session]);

  if (!user) {
    return (
      <div className="absolute inset-0 flex min-h-0 flex-col">
        <div className="h-full min-h-0 flex flex-1 flex-col justify-center">
          <div className="flex min-w-0 flex-col items-center gap-2 px-4">
            <div className={cn(EDITOR_CARD_CLASS, 'w-full max-w-2xl')}>
              <p className="m-0 text-balance text-center text-sm text-foreground/90">{t('textUnauthorized')}</p>
              <div className="flex justify-center">
                <Button asChild variant="action" className={ctaActionButtonClassName}>
                  <Link href={loginRouteWithCallbackUrl}>{t('btnGoToLogin')}</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster richColors />

      <div className="absolute inset-0 flex min-h-0 flex-col">
        <Header />

        <PageTitle title={t('pageTitle')} />

        <div className={visaMainScrollClass}>
          <div className={visaContentColumnClass}>
            <div className="mx-auto flex w-full min-w-0 max-w-2xl flex-col gap-3">
              <div className={EDITOR_CARD_CLASS}>
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

                <FieldRow label={t('inputCountry')}>
                  <ComboBox
                    menus={menuCountries}
                    value={countryCode ? countryCode : ''}
                    searchEnabled={true}
                    onChange={(value: any) => {
                      setCountryCode(value);
                    }}
                  />
                </FieldRow>

                <TextInput
                  id={'passportNumber'}
                  label={t('inputPassportNumber')}
                  value={passportNumber}
                  placeholder={t('inputPlaceholderPassportNumber')}
                  onChange={e => {
                    handlePassportNumberChanged(e.currentTarget.value);
                  }}
                />

                <FieldRow label={t('datePickerBirthday')}>
                  <DatePicker
                    date={moment(birthday)}
                    fromDate={moment(1970)}
                    toDate={moment().subtract(6, 'y')}
                    onChange={value => {
                      handleBirthdayChanged(value);
                    }}
                  />
                </FieldRow>
              </div>

            </div>
          </div>
        </div>

        <Navigation>
          <ActionButton href={routeHome} action={Action.BACK} />
          <Button
            type="button"
            variant="action"
            className={ctaActionButtonClassName}
            disabled={!checkInputs()}
            onClick={handleSendClicked}
          >
            {t('btnSendRequest')}
          </Button>
        </Navigation>
      </div>
    </>
  );
}
