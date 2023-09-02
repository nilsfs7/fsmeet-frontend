import { NextPage } from 'next';
import { useState } from 'react';
import TextButton from '@/components/common/TextButton';
import TextInput from '@/components/common/TextInput';
import router from 'next/router';
import { routePasswordPending } from '@/types/consts/routes';
import ErrorMessage from '@/components/ErrorMessage';

const ForgotPassword: NextPage = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleInputChangeUsername = (event: any) => {
    const uname: string = event.target.value;
    setUsername(uname.toLowerCase());
  };

  const handleInputKeypressUsername = (e: any) => {
    if (e.keyCode === 13) {
      handleResetClicked();
    }
  };

  const handleResetClicked = async () => {
    setError('');

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/users/password/forgot`, {
      method: 'POST',
      body: JSON.stringify({ username: username }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status == 201) {
      router.replace(routePasswordPending);
    } else {
      const error = await response.json();
      setError(error.message);
      console.log(error.message);
    }
  };

  return (
    <>
      <div className={'flex h-screen columns-1 flex-col items-center justify-center'}>
        <div className="m-2 flex flex-col rounded-lg bg-primary-light p-1">
          <TextInput
            id={'username'}
            label={'Username'}
            placeholder="Max"
            value={username}
            onChange={e => {
              handleInputChangeUsername(e);
            }}
            onKeyDown={handleInputKeypressUsername}
          />
        </div>

        <div className="flex justify-center py-2">
          <TextButton text="Reset Password" onClick={handleResetClicked} />
        </div>

        <ErrorMessage message={error} />
      </div>
    </>
  );
};

export default ForgotPassword;
