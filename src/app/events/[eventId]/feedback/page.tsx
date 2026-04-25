'use client';

import { useState, use } from 'react';
import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import TextInputLarge from '@/components/common/text-input-large';
import { useRouter } from 'next/navigation';
import { routeEvents, routeFeedbackThankyou } from '@/domain/constants/routes';
import Navigation from '@/components/navigation';
import ActionButton from '@/components/common/action-button';
import { Action } from '@/domain/enums/action';
import { Toaster, toast } from 'sonner';
import PageTitle from '@/components/page-title';
import { createEventFeedback } from '@/infrastructure/clients/event.client';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';

const EDITOR_CARD_CLASS = cn(
  'flex w-full max-w-2xl min-w-0 flex-col overflow-y-auto scrollbar-none',
  'gap-3 rounded-xl border border-border/60 bg-secondary-light/85 p-2.5 shadow-xs backdrop-blur-sm',
  'supports-[backdrop-filter]:bg-secondary-light/70',
  'dark:border-border/50 dark:bg-background/60 dark:supports-[backdrop-filter]:bg-background/50',
);

export default function EventFeedback(props: { params: Promise<{ eventId: string }> }) {
  const params = use(props.params);
  const t = useTranslations('/events/eventid/feedback');
  const { data: session } = useSession();
  const router = useRouter();

  const [message, setMessage] = useState('');

  const handleSubmitClicked = async () => {
    try {
      await createEventFeedback(params.eventId, message, session);
      router.push(routeFeedbackThankyou);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      toast.error(msg);
      console.error(msg);
    }
  };

  return (
    <>
      <Toaster richColors />

      <div className="min-h-0 flex-1 flex flex-col">
        <PageTitle title={t('pageTitle')} />

        <div className="flex min-h-0 flex-1 flex-col items-center overflow-y-auto px-4 py-4 sm:px-6 md:px-8">
          <div className={EDITOR_CARD_CLASS}>
            <TextInputLarge
              id="message"
              label={t('inputMessage')}
              placeholder={t('inputMessagePlaceholder')}
              value={message}
              resizable
              onChange={e => setMessage(e.target.value)}
            />
          </div>
        </div>

        <Navigation>
          <ActionButton href={`${routeEvents}/${params.eventId}`} action={Action.BACK} />

          <Button type="button" variant="action" className={ctaActionButtonClassName} onClick={handleSubmitClicked}>
            {t('btnSubmit')}
          </Button>
        </Navigation>
      </div>
    </>
  );
}
