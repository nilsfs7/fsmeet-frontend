import { useState } from 'react';
import TextButton from '@/components/common/TextButton';
import TextInputLarge from '@/components/common/TextInputLarge';
import router from 'next/router';
import { getSession } from 'next-auth/react';
import { routeFeedback, routeFeedbackThankyou, routeLogin } from '@/types/consts/routes';
import ErrorMessage from '@/components/ErrorMessage';
import Navigation from '@/components/Navigation';
import Link from 'next/link';
import { Action } from '@/types/enums/action';
import ActionButton from '@/components/common/ActionButton';
import { validateSession } from '@/types/funcs/validate-session';
import { GetServerSidePropsContext } from 'next';

const ReportBug = (props: any) => {
  const session = props.session;

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleInputChangeMessage = (event: any) => {
    setMessage(event.target.value);
  };

  const handleSubmitClicked = async () => {
    setError('');

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/feedback/features`, {
      method: 'POST',
      body: JSON.stringify({ message: message }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.user.accessToken}`,
      },
    });

    if (response.status == 201) {
      router.push(routeFeedbackThankyou);
    } else {
      const error = await response.json();
      setError(error.message);
      console.error(error.message);
    }
  };

  return (
    <div className={'absolute inset-0 flex flex-col'}>
      <div className="mx-2 flex flex-col overflow-y-auto">
        <h1 className="mt-2 text-center text-xl">Feature Request</h1>

        <div className="mt-2 h-48 w-full rounded-lg border border-primary bg-secondary-light">
          <TextInputLarge
            id={'message'}
            label={'Message'}
            placeholder="Does the app lack some feature or do you have any wishes?"
            onChange={e => {
              handleInputChangeMessage(e);
            }}
          />
        </div>

        <ErrorMessage message={error} />
      </div>

      <Navigation>
        <Link href={routeFeedback}>
          <ActionButton action={Action.BACK} />
        </Link>

        <TextButton text="Submit" onClick={handleSubmitClicked} />
      </Navigation>
    </div>
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
