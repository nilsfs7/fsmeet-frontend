'use client';

import { useState } from 'react';
import TextButton from '@/components/common/TextButton';
import TextInputLarge from '@/components/common/TextInputLarge';
import { routeFeedback, routeFeedbackThankyou } from '@/domain/constants/routes';
import Navigation from '@/components/Navigation';
import ActionButton from '@/components/common/ActionButton';
import Link from 'next/link';
import { Action } from '@/domain/enums/action';
import PageTitle from '@/components/PageTitle';
import { Toaster, toast } from 'sonner';
import { createFeedbackGeneral } from '@/infrastructure/clients/feedback.client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function GeneralFeedback() {
  const { data: session } = useSession();
  const router = useRouter();

  const [message, setMessage] = useState('');

  const handleInputChangeMessage = (event: any) => {
    setMessage(event.target.value);
  };

  const handleSubmitClicked = async () => {
    try {
      await createFeedbackGeneral(message, session);
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
        <PageTitle title="Send Feedback" />

        <div className="mx-2 flex flex-col overflow-y-auto">
          <div className="mt-2 h-48 w-full rounded-lg border border-primary bg-secondary-light">
            <TextInputLarge
              id={'message'}
              label={'Message'}
              placeholder="Any feedback is highly appreciated!"
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

          <TextButton text="Submit" onClick={handleSubmitClicked} />
        </Navigation>
      </div>
    </>
  );
}
