import { useState } from 'react';
import TextButton from '@/components/common/TextButton';
import TextInput from '@/components/common/TextInput';
import bcrypt from 'bcryptjs';
import { useRouter } from 'next/router';
import { routeLogin } from '@/types/consts/routes';
import ErrorMessage from '@/components/ErrorMessage';

const ResetPassword = () => {
  const router = useRouter();
  const { requestToken } = router.query;

  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleInputChangePassword = (event: any) => {
    const hashedPassword = bcrypt.hashSync(event.target.value, '$2a$10$CwTycUXWue0Thq9StjUM0u');
    setPassword(hashedPassword);
  };

  const handleInputKeypressPassword = (e: any) => {
    if (e.keyCode === 13) {
      handleSaveClicked();
    }
  };

  const handleSaveClicked = async () => {
    setError('');

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/users/password/reset`, {
      method: 'PATCH',
      body: JSON.stringify({ requestToken: requestToken, password: password }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status == 200) {
      router.replace(routeLogin);
    } else {
      const error = await response.json();
      setError(error.message);
      console.error(error.message);
    }
  };

  return (
    <>
      <div className={'flex h-screen columns-1 flex-col items-center justify-center'}>
        <div className="m-2 flex flex-col rounded-lg bg-secondary-light p-1">
          <TextInput
            id={'password'}
            type={'password'}
            label={'New password'}
            placeholder="Ball&Chill2021"
            onChange={e => {
              handleInputChangePassword(e);
            }}
            onKeyDown={handleInputKeypressPassword}
          />
        </div>

        <div className="flex justify-center py-2">
          <TextButton text="Save" onClick={handleSaveClicked} />
        </div>

        <ErrorMessage message={error} />
      </div>
    </>
  );
};

export default ResetPassword;
