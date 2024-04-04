import { useState } from 'react';
import TextButton from '@/components/common/TextButton';
import TextInputLarge from '@/components/common/TextInputLarge';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import { routeFeedback, routeFeedbackThankyou } from '@/types/consts/routes';
import Navigation from '@/components/Navigation';
import ActionButton from '@/components/common/ActionButton';
import Link from 'next/link';
import { Action } from '@/types/enums/action';
import { GetServerSidePropsContext } from 'next';
import { Toaster, toast } from 'sonner';
import { createEventFeedback } from '@/services/fsmeet-backend/create-event-feedback';

const GeneralFeedback = (props: any) => {
  const session = props.session;

  const router = useRouter();
  const { eventId } = router.query;

  const [message, setMessage] = useState('');

  const handleInputChangeMessage = (event: any) => {
    setMessage(event.target.value);
  };

  const handleSubmitClicked = async () => {
    if (eventId) {
      try {
        await createEventFeedback(eventId.toString(), message, session);
        router.push(routeFeedbackThankyou);
      } catch (error: any) {
        toast.error(error.message);
        console.error(error.message);
      }
    }
  };

  return (
    <>
      <Toaster richColors />

      <div className={'absolute inset-0 flex flex-col'}>
        <div className="mx-2 flex flex-col overflow-y-auto">
          <h1 className="mt-2 text-center text-xl">Send Event Feedback</h1>

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
};

export default GeneralFeedback;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await getSession(context);

  return {
    props: {
      session: session,
    },
  };
};
