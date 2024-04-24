import { useState } from 'react';
import TextButton from '@/components/common/TextButton';
import TextInput from '@/components/common/TextInput';
import router from 'next/router';
import { routeLogin, routePasswordPending } from '@/types/consts/routes';
import ErrorMessage from '@/components/ErrorMessage';
import { createPasswordReset } from '@/services/fsmeet-backend/create-password-reset';
import Navigation from '@/components/Navigation';
import Link from 'next/link';
import { Action } from '@/types/enums/action';
import ActionButton from '@/components/common/ActionButton';

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
    <div className={'absolute inset-0 flex flex-col'}>
      <div className="p-2 h-full grid overflow-y-auto">
        <div className={'h-full flex flex-col items-center justify-center'}>
          <div className="m-2 flex flex-col rounded-lg bg-secondary-light p-1">
            <TextInput
              id={'usernameOrEmail'}
              label={'Username / Email'}
              placeholder="max"
              value={usernameOrEmail}
              onChange={(e) => {
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
      </div>

      <Navigation>
        <Link href={routeLogin}>
          <ActionButton action={Action.BACK} />
        </Link>
      </Navigation>
    </div>
  );
};

export default ForgotPassword;
