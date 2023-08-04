import { GetServerSideProps, NextPage } from 'next';
import { useState } from 'react';
import TextButton from '@/components/common/TextButton';
import TextInputLarge from '@/components/common/TextInputLarge';
import router from 'next/router';
import { getSession } from 'next-auth/react';

const GeneralFeedback: NextPage = (props: any) => {
  const session = props.session;

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleInputChangeMessage = (event: any) => {
    setMessage(event.target.value);
  };

  const handleSubmitClicked = async () => {
    setError('');

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/feedback/general`, {
      method: 'POST',
      body: JSON.stringify({ message: message }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.user.accessToken}`,
      },
    });

    if (response.status == 201) {
      router.push(`feedback/thankyou`);
    } else {
      const error = await response.json();
      setError(error.message);
      console.log(error.message);
    }
  };

  return (
    <div className={'absolute inset-0 flex flex-col items-center justify-center'}>
      <h1 className="mb-2 text-center text-xl">Send Feedback</h1>
      <div className="m-2 h-1/2 w-[95%] rounded-lg bg-zinc-300">
        <TextInputLarge
          id={'message'}
          label={'Message'}
          placeholder="Any feedback is highly appriciented!"
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

export default GeneralFeedback;

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const session = await getSession(context);

  return {
    props: {
      session: session,
    },
  };
};
