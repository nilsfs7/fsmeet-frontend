import { NextPage } from 'next';
import { useState } from 'react';
import TextButton from '@/components/common/TextButton';
import TextInputLarge from '@/components/common/TextInputLarge';
import router from 'next/router';

const ReportBug: NextPage = () => {
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
    <>
      <div className={'flex h-screen columns-1 flex-col items-center justify-center'}>
        <h1 className="mb-2 text-center text-xl">Feature Request</h1>
        <div className="m-2 h-1/2 w-[95%] rounded-lg bg-zinc-300">
          <TextInputLarge
            id={'message'}
            label={'Message'}
            placeholder="Does the app lack some feature or do you have any wishes?"
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
    </>
  );
};

export default ReportBug;
