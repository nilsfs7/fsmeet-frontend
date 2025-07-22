'use client';

import TextButton from '@/components/common/TextButton';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Toaster, toast } from 'sonner';
import { isRegistered } from './tabs-menu';
import { Event } from '@/domain/types/event';
import moment from 'moment';
import { validateSession } from '@/functions/validate-session';
import { useRouter } from 'next/navigation';
import { routeEvents, routeLogin } from '@/domain/constants/routes';
import { createEventRegistration, deleteEventRegistration } from '@/infrastructure/clients/event.client';
import Dialog from '@/components/Dialog';
import { CashInfo } from './payment/cash-info';
import { PayPalInfo } from './payment/paypal-info';
import { SepaInfo } from './payment/sepa-info';
import Separator from '@/components/Seperator';
import Label from '@/components/Label';
import { convertCurrencyIntegerToDecimal } from '@/functions/currency-conversion';
import { getCurrencySymbol } from '@/functions/get-currency-symbol';
import { useEffect, useState } from 'react';

interface ITextButtonRegister {
  event: Event;
}

export const TextButtonRegister = ({ event }: ITextButtonRegister) => {
  const t = useTranslations('/events/eventid');

  const { data: session } = useSession();
  const router = useRouter();

  const [loginRouteWithCallbackUrl, setLoginRouteWithCallbackUrl] = useState<string>('');

  const registrationStatus: string =
    event.eventRegistrations.filter(registration => {
      if (registration.user.username === session?.user.username) {
        return registration.status;
      }
    })[0]?.status || 'Unregistered';

  const handleCancelDialogClicked = async () => {
    router.replace(`${routeEvents}/${event.id}`);
    router.refresh();
  };

  const handleRegistrationClicked = async () => {
    if (!validateSession(session)) {
      router.push(loginRouteWithCallbackUrl);
      return;
    }

    if (event && moment(event?.registrationDeadline).unix() > moment().unix()) {
      router.replace(`${routeEvents}/${event.id}?registration=1`);
    } else {
      console.error('Registration deadline exceeded.');
    }
  };

  const handleConfirmRegisterClicked = async () => {
    if (!validateSession(session)) {
      router.push(loginRouteWithCallbackUrl);
      return;
    }

    if (session?.user?.username) {
      if (event?.id && moment(event?.registrationDeadline).unix() > moment().unix()) {
        try {
          await createEventRegistration(event.id, session.user.username, session);
          router.replace(`${routeEvents}/${event.id}?registrationstatus=1`);
        } catch (error: any) {
          console.error(error.message);
        }
      } else {
        console.error('Registration deadline exceeded.');
      }
    }
  };

  const handleConfirmUnregisterClicked = async () => {
    if (!validateSession(session)) {
      router.push(loginRouteWithCallbackUrl);
      return;
    }

    if (session?.user?.username) {
      if (event?.id && moment(event?.registrationDeadline).unix() > moment().unix()) {
        try {
          await deleteEventRegistration(event.id, session.user.username, session);
          router.replace(`${routeEvents}/${event.id}`);
          router.refresh();
        } catch (error: any) {
          console.error(error.message);
        }
      } else {
        console.error('Registration deadline exceeded.');
      }
    }
  };

  const handleUnregisterClicked = async () => {
    if (!validateSession(session)) {
      router.push(loginRouteWithCallbackUrl);
      return;
    }

    if (event && moment(event?.registrationDeadline).unix() > moment().unix()) {
      router.replace(`${routeEvents}/${event.id}?unregister=1`);
    } else {
      console.error('Registration deadline exceeded.');
    }
  };

  useEffect(() => {
    setLoginRouteWithCallbackUrl(`${routeLogin}?callbackUrl=${window.location.origin}${routeEvents}%2F${event.id}`);
  }, []);

  return (
    <>
      <Toaster richColors />

      <Dialog
        title={t('dlgEventRegistrationTitle')}
        queryParam="registration"
        onCancel={handleCancelDialogClicked}
        onConfirm={isRegistered(event, session) ? handleUnregisterClicked : handleConfirmRegisterClicked}
        confirmText={isRegistered(event, session) ? t('dlgEventRegistrationBtnUnregister') : t('dlgEventRegistrationBtnRegister')}
        executeCancelAfterConfirmClicked={false}
      >
        <div>
          {isRegistered(event, session) ? (
            <div className="flex gap-2 items-center">
              <div>{`${t('dlgEventRegistrationRegistrationStatus')}:`}</div>
              <Label text={registrationStatus} />
            </div>
          ) : (
            `${t('dlgEventRegistrationText1')} ${event.name}?`
          )}
        </div>

        {event.participationFee > 0 && (
          <>
            <div className="mt-4 mb-2">
              <Separator />
            </div>

            <div className="mt-4">
              {`${t('dlgEventRegistrationText2')} ${convertCurrencyIntegerToDecimal(event.participationFee, event.currency).toFixed(2).replace('.', ',')} ${getCurrencySymbol(event.currency)}.`}
              {event.autoApproveRegistrations ?? t('dlgEventRegistrationText3')}
            </div>

            {event.paymentMethodCash.enabled && (
              <div className="mt-4">
                <CashInfo participationFee={event.participationFee} currency={event.currency} />
              </div>
            )}

            {event.paymentMethodPayPal.enabled && session?.user?.username && (
              <div className="mt-4">
                <PayPalInfo participationFee={event.participationFee} currency={event.currency} payPalInfo={event.paymentMethodPayPal} usernameForReference={session.user.username} />
              </div>
            )}

            {event.paymentMethodSepa.enabled && session?.user?.username && (
              <div className="mt-4">
                <SepaInfo participationFee={event.participationFee} currency={event.currency} sepaInfo={event.paymentMethodSepa} usernameForReference={session.user.username} />
              </div>
            )}

            {(event.paymentMethodSepa.enabled || event.paymentMethodPayPal.enabled) && <div className="mt-4">{t('dlgEventRegistrationText4')}</div>}
          </>
        )}
      </Dialog>

      <Dialog title={t('dlgEventRegistrationSuccessfulTitle')} queryParam="registrationstatus" onConfirm={handleCancelDialogClicked} confirmText={t('dlgEventRegistrationSuccessfulBtnOk')}>
        <div>{t('dlgEventRegistrationSuccessfulText1')}</div>
        {event.participationFee > 0 && <div>{t('dlgEventRegistrationSuccessfulText2')}</div>}
      </Dialog>

      <Dialog
        title={t('dlgEventUnregisterTitle')}
        queryParam="unregister"
        onCancel={handleCancelDialogClicked}
        onConfirm={handleConfirmUnregisterClicked}
        confirmText={t('dlgEventUnregisterBtnConfirm')}
      >
        <p>{t('dlgEventUnregisterText')}</p>
      </Dialog>

      {moment(event.registrationOpen).unix() < moment().unix() && moment(event.registrationDeadline).unix() > moment().unix() && (
        <TextButton text={t('btnRegistration')} onClick={handleRegistrationClicked} />
      )}
    </>
  );
};
