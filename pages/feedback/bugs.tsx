import { GetServerSideProps, NextPage } from 'next';
import { useState } from 'react';
import TextButton from '@/components/common/TextButton';
import TextInputLarge from '@/components/common/TextInputLarge';
import router from 'next/router';
import { getSession } from 'next-auth/react';
import { routeFeedbackThankyou } from '@/types/consts/routes';

const ReportBug: NextPage = (props: any) => {
  const session = props.session;

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleInputChangeMessage = (event: any) => {
    setMessage(event.target.value);
  };

  const handleSubmitClicked = async () => {
    setError('');

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/feedback/bugs`, {
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
      console.log(error.message);
    }
  };

  return (
    <div className={'absolute inset-0 flex flex-col items-center justify-center'}>
      <h1 className="mb-2 text-center text-xl">Report Bug</h1>
      <div className="m-2 h-1/2 w-[95%] rounded-lg bg-zinc-300">
        <TextInputLarge
          id={'message'}
          label={'Message'}
          placeholder="Describe any misbehavior you noticed."
          onChange={e => {
            handleInputChangeMessage(e);
          }}
        />
      </div>

      <div className="flex justify-center py-2">
        <TextButton text="Submit" onClick={handleSubmitClicked} />
      </div>

      {error != '' && (
        <div className="flex justify-center py-2">
          <label className="text-dark-red">{error}</label>
        </div>
      )}
    </div>
  );
};

export default ReportBug;

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const session = await getSession(context);

  return {
    props: {
      session: session,
    },
  };
};
