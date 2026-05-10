'use client';

import { useState } from 'react';
import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import TextInputLarge from '@/components/common/text-input-large';
import { useRouter } from 'next/navigation';
import { routeFeedback, routeFeedbackThankyou } from '@/domain/constants/routes';
import Navigation from '@/components/navigation';
import { Action } from '@/domain/enums/action';
import ActionButton from '@/components/common/action-button';
import PageTitle from '@/components/page-title';
import { Toaster, toast } from 'sonner';
import { createFeedbackBug } from '@/infrastructure/clients/feedback.client';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

const EDITOR_CARD_CLASS = cn(
  'flex w-full max-w-2xl min-w-0 flex-col overflow-y-auto scrollbar-none',
  'gap-3 rounded-xl border border-border/60 bg-secondary-light/85 p-2.5 shadow-xs backdrop-blur-sm',
  'supports-[backdrop-filter]:bg-secondary-light/70',
  'dark:border-border/50 dark:bg-background/60 dark:supports-[backdrop-filter]:bg-background/50',
);

export default function ReportBug() {
  const t = useTranslations('/feedback/bugs');

  const { data: session } = useSession();
  const router = useRouter();

  const [message, setMessage] = useState('');

  const handleSubmitClicked = async () => {
    try {
      await createFeedbackBug(message, session);
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
          <ActionButton href={routeFeedback} action={Action.BACK} />

          <Button type="button" variant="action" className={ctaActionButtonClassName} onClick={handleSubmitClicked}>
            {t('btnSubmit')}
          </Button>
        </Navigation>
      </div>
    </>
  );
}
