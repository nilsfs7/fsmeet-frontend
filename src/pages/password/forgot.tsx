import { useState } from 'react';
import TextButton from '@/components/common/TextButton';
import TextInput from '@/components/common/TextInput';
import router from 'next/router';
import { routePasswordPending } from '@/types/consts/routes';
import ErrorMessage from '@/components/ErrorMessage';
import { createPasswordReset } from '@/services/fsmeet-backend/create-password-reset';

const ForgotPassword = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [error, setError] = useState('');

  const handleInputChangeUsername = (event: any) => {
    const uname: string = event.target.value;
    setUsernameOrEmail(uname.toLowerCase());
  };

  const handleInputKeypressUsername = (e: any) => {
    if (e.keyCode === 13) {
      handleResetClicked();
    }
  };

  const handleResetClicked = async () => {
    setError('');

    try {
      await createPasswordReset(usernameOrEmail);
      router.replace(routePasswordPending);
    } catch (error: any) {
      setError(error.message);
      console.error(error.message);
    }
  };

  return (
    <>
      <div className={'flex h-screen columns-1 flex-col items-center justify-center'}>
        <div className="m-2 flex flex-col rounded-lg bg-secondary-light p-1">
          <TextInput
            id={'usernameOrEmail'}
            label={'Username / Email'}
            placeholder="max"
            value={usernameOrEmail}
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
