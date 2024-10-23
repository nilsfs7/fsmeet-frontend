'use client';

import TextButton from '@/components/common/TextButton';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Toaster, toast } from 'sonner';
import { isRegistered } from './tabs-menu';
import { Event } from '@/types/event';
import moment from 'moment';
import { validateSession } from '@/functions/validate-session';
import { useRouter } from 'next/navigation';
import { routeEvents, routeLogin } from '@/domain/constants/routes';
import { createEventRegistration, deleteEventRegistration } from '@/infrastructure/clients/event.client';
import Dialog from '@/components/Dialog';
import SepaInfo from '@/components/payment/sepa-info';
import PayPalInfo from '@/components/payment/paypal-info';
import CashInfo from '@/components/payment/cash-info';

interface ITextButtonRegister {
  event: Event;
}

export const TextButtonRegister = ({ event }: ITextButtonRegister) => {
  const t = useTranslations('/events/eventid');

  const { data: session } = useSession();
  const router = useRouter();

  const handleCancelDialogClicked = async () => {
    let url = `${routeEvents}/${event.id}`;
    router.replace(url);
  };

  const handleRegisterClicked = async () => {
    if (!validateSession(session)) {
      router.push(routeLogin);
      return;
    }

    if (event && moment(event?.registrationDeadline).unix() > moment().unix()) {
      router.replace(`${routeEvents}/${event.id}?register=1`);
    } else {
      console.error('Registration deadline exceeded.');
    }
  };

  const handleConfirmRegisterClicked = async () => {
    if (!validateSession(session)) {
      router.push(routeLogin);
      return;
    }

    if (session?.user?.username) {
      if (event?.id && moment(event?.registrationDeadline).unix() > moment().unix()) {
        try {
          await createEventRegistration(event.id, session.user.username, session);
          router.refresh();
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
      router.push(routeLogin);
      return;
    }

    if (session?.user?.username) {
      if (event?.id && moment(event?.registrationDeadline).unix() > moment().unix()) {
        try {
          await deleteEventRegistration(event.id, session.user.username, session);
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
      router.push(routeLogin);
      return;
    }

    if (event && moment(event?.registrationDeadline).unix() > moment().unix()) {
      router.replace(`${routeEvents}/${event.id}?unregister=1`);
    } else {
      console.error('Registration deadline exceeded.');
    }
  };

  return (
    <>
      <Toaster richColors />

      <Dialog title={t('dlgEventRegisterTitle')} queryParam="register" onCancel={handleCancelDialogClicked} onConfirm={handleConfirmRegisterClicked} confirmText="Register now">
        <div>{`${t('dlgEventRegisterText1')} ${event.name}`}?</div>

        {event.participationFee > 0 && (
          <>
            <div className="mt-4">
              {t('dlgEventRegisterText2')} {event.participationFee.toString().replace('.', ',')}€. {event.autoApproveRegistrations ?? t('dlgEventRegisterText3')}
            </div>

            {event.paymentMethodCash.enabled && (
              <div className="mt-4">
                <CashInfo participationFee={event.participationFee} />
              </div>
            )}

            {event.paymentMethodPayPal.enabled && session?.user?.username && (
              <div className="mt-4">
                <PayPalInfo participationFee={event.participationFee} payPalInfo={event.paymentMethodPayPal} usernameForReference={session.user.username} />
              </div>
            )}

            {event.paymentMethodSepa.enabled && session?.user?.username && (
              <div className="mt-4">
                <SepaInfo participationFee={event.participationFee} sepaInfo={event.paymentMethodSepa} usernameForReference={session.user.username} />
              </div>
            )}

            {(event.paymentMethodSepa.enabled || event.paymentMethodPayPal.enabled) && <div className="mt-4">{t('dlgEventRegisterText4')}</div>}
          </>
        )}
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
        <TextButton text={isRegistered(event, session) ? t('btnUnregister') : t('btnRegister')} onClick={isRegistered(event, session) ? handleUnregisterClicked : handleRegisterClicked} />
      )}
    </>
  );
};
