'use client';

import { useState } from 'react';
import TextButton from '@/components/common/TextButton';
import TextInputLarge from '@/components/common/TextInputLarge';
import { useRouter } from 'next/navigation';
import { routeFeedback, routeFeedbackThankyou } from '@/domain/constants/routes';
import Navigation from '@/components/Navigation';
import Link from 'next/link';
import { Action } from '@/domain/enums/action';
import ActionButton from '@/components/common/ActionButton';
import PageTitle from '@/components/PageTitle';
import { Toaster, toast } from 'sonner';
import { createFeedbackBug } from '@/infrastructure/clients/feedback.client';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';

export default function ReportBug() {
  const t = useTranslations('/feedback/bugs');

  const { data: session } = useSession();
  const router = useRouter();

  const [message, setMessage] = useState('');

  const handleInputChangeMessage = (event: any) => {
    setMessage(event.target.value);
  };

  const handleSubmitClicked = async () => {
    try {
      await createFeedbackBug(message, session);
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
          <div className="mt-2 h-48 w-full rounded-lg border border-primary bg-secondary-light">
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
          <Link href={routeFeedback}>
            <ActionButton action={Action.BACK} />
          </Link>

          <TextButton text={t('btnSubmit')} onClick={handleSubmitClicked} />
        </Navigation>
      </div>
    </>
  );
}
