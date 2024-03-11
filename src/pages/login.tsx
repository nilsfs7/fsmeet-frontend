import { useState } from 'react';
import TextButton from '@/components/common/TextButton';
import Link from 'next/link';
import { getSession, signIn } from 'next-auth/react';
import router from 'next/router';
import TextInput from '@/components/common/TextInput';
import bcrypt from 'bcryptjs';
import ErrorMessage from '@/components/ErrorMessage';
import { useSearchParams } from 'next/navigation';
import { routeHome, routePasswordForgot, routeRegistration } from '@/types/consts/routes';

const Login = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redir');

  const handleInputChangeUsernameOrEmail = (event: any) => {
    const usernameOrEmail: string = event.target.value;
    setUsernameOrEmail(usernameOrEmail.toLowerCase());
  };

  const handleInputChangePassword = (event: any) => {
    const hashedPassword = bcrypt.hashSync(event.target.value, '$2a$10$CwTycUXWue0Thq9StjUM0u');
    setPassword(hashedPassword);
  };

  const handleInputKeypressPassword = (e: any) => {
    if (e.keyCode === 13) {
      handleLoginClicked();
    }
  };

  const handleLoginClicked = async () => {
    setError('');

    const response = await signIn('credentials', { usernameOrEmail: usernameOrEmail, password: password, redirect: false });

    let err = 'Unknown error.';
    switch (response?.status) {
      case 200:
        const session = await getSession();
        if (session) {
          localStorage.setItem('username', session.user.username);
          if (session.user.imageUrl) {
            localStorage.setItem('imageUrl', session.user.imageUrl);
          }

          if (redirectUrl) {
            router.replace(redirectUrl);
          } else {
            router.replace(routeHome);
          }
        } else {
          console.error('unknown error');
        }
        break;

      case 401:
        err = 'Wrong username or password.';
        setError(err);
        console.error(err);
        break;

      default:
        setError(err);
        console.error(err);
        break;
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
              handleInputChangeUsernameOrEmail(e);
            }}
          />
          <TextInput
            id={'password'}
            type={'password'}
            label={'Password'}
            placeholder="Ball&Chill2021"
            onChange={e => {
              handleInputChangePassword(e);
            }}
            onKeyDown={handleInputKeypressPassword}
          />
        </div>

        <div className="flex justify-center py-2">
          <TextButton text="Login" onClick={handleLoginClicked} />
        </div>

        <ErrorMessage message={error} />

        <div className="flex justify-center py-2">
          <Link href={`${routePasswordForgot}`}>
            <label className="cursor-pointer pr-4 underline">Reset password</label>
          </Link>
        </div>

        <div className="flex justify-center py-2">
          <Link href={`${routeRegistration}`}>
            <label className="cursor-pointer pr-4 underline">No account yet?</label>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Login;
