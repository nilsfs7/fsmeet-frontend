import { useState } from 'react';
import TextButton from '@/components/common/TextButton';
import TextInputLarge from '@/components/common/TextInputLarge';
import router from 'next/router';
import { getSession } from 'next-auth/react';
import { routeFeedback, routeFeedbackThankyou, routeLogin } from '@/types/consts/routes';
import Navigation from '@/components/Navigation';
import Link from 'next/link';
import { Action } from '@/types/enums/action';
import ActionButton from '@/components/common/ActionButton';
import { validateSession } from '@/types/funcs/validate-session';
import { GetServerSidePropsContext } from 'next';
import { createFeedbackFeature } from '@/services/fsmeet-backend/create-feedback-feature';
import PageTitle from '@/components/PageTitle';
import { Toaster, toast } from 'sonner';

const ReportBug = (props: any) => {
  const session = props.session;

  const [message, setMessage] = useState('');

  const handleInputChangeMessage = (event: any) => {
    setMessage(event.target.value);
  };

  const handleSubmitClicked = async () => {
    try {
      await createFeedbackFeature(message, session);
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
        <PageTitle title="Feature Request" />

        <div className="mx-2 flex flex-col overflow-y-auto">
          <div className="mt-2 h-48 w-full rounded-lg border border-primary bg-secondary-light">
            <TextInputLarge
              id={'message'}
              label={'Message'}
              placeholder="Does the app lack some feature or do you have any wishes?"
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

export default ReportBug;
export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await getSession(context);

  if (!validateSession(session)) {
    return {
      redirect: {
        permanent: false,
        destination: routeLogin,
      },
    };
  }

  return {
    props: {
      session: session,
    },
  };
};
