'use client';

import { useState, use } from 'react';
import TextButton from '@/components/common/TextButton';
import TextInputLarge from '@/components/common/TextInputLarge';
import { useRouter } from 'next/navigation';
import { routeEvents, routeFeedbackThankyou } from '@/domain/constants/routes';
import Navigation from '@/components/Navigation';
import ActionButton from '@/components/common/ActionButton';
import Link from 'next/link';
import { Action } from '@/domain/enums/action';
import { Toaster, toast } from 'sonner';
import PageTitle from '@/components/PageTitle';
import { createEventFeedback } from '@/infrastructure/clients/event.client';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';

export default function EventFeedback(props: { params: Promise<{ eventId: string }> }) {
  const params = use(props.params);
  const t = useTranslations('/events/eventid/feedback');
  const { data: session } = useSession();
  const router = useRouter();

  const [message, setMessage] = useState('');

  const handleInputChangeMessage = (event: any) => {
    setMessage(event.target.value);
  };

  const handleSubmitClicked = async () => {
    try {
      await createEventFeedback(params.eventId, message, session);
      router.push(routeFeedbackThankyou);
    } catch (error: any) {
      toast.error(error.message);
      console.error(error.message);
    }
  };

  return (
    <>
      <Toaster richColors />

      <div className={'absolute inset-0 flex flex-col'}>
        <PageTitle title={t('pageTitle')} />

        <div className="mx-2 flex flex-col overflow-y-auto">
          <div className="h-48 w-full rounded-lg border border-primary bg-secondary-light">
            <TextInputLarge
              id={'message'}
              label={t('inputMessage')}
              placeholder={t('inputMessagePlaceholder')}
              onChange={(e) => {
                handleInputChangeMessage(e);
              }}
            />
          </div>
        </div>

        <Navigation>
          <Link href={`${routeEvents}/${params.eventId}`}>
            <ActionButton action={Action.BACK} />
          </Link>

          <TextButton text={t('btnSubmit')} onClick={handleSubmitClicked} />
        </Navigation>
      </div>
    </>
  );
}
