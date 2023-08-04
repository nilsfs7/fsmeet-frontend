import { NextPage } from 'next';
import { useState } from 'react';
import TextButton from '@/components/common/TextButton';
import Link from 'next/link';
import { getSession, signIn } from 'next-auth/react';
import router from 'next/router';
import TextInput from '@/components/common/TextInput';
import bcrypt from 'bcryptjs';

const Login: NextPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleInputChangeUsername = (event: any) => {
    const uname: string = event.target.value;
    setUsername(uname.toLowerCase());
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

    const response = await signIn('credentials', { username: username, password: password, redirect: false });

    let err = 'Unknown error.';
    switch (response?.status) {
      case 200:
        const session = await getSession();
        if (session) {
          localStorage.setItem('username', session.user.username);
          if (session.user.imageUrl) {
            localStorage.setItem('imageUrl', session.user.imageUrl);
          }

          router.replace('/');
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
        <div className="m-2 flex flex-col rounded-lg bg-zinc-300 p-1">
          <TextInput
            id={'username'}
            label={'Username'}
            placeholder="Max"
            value={username}
            onChange={e => {
              handleInputChangeUsername(e);
            }}
          />
          <TextInput
            id={'password'}
            type={'password'}
            label={'Password'}
            placeholder="123"
            onChange={e => {
              handleInputChangePassword(e);
            }}
            onKeyDown={handleInputKeypressPassword}
          />
        </div>

        <div className="flex justify-center py-2">
          <TextButton text="Login" onClick={handleLoginClicked} />
        </div>

        {error != '' && (
          <div className="flex justify-center py-2">
            <label className="text-dark-red">{error}</label>
          </div>
        )}

        <div className="flex justify-center py-2">
          <Link href={'/password/forgot'}>
            <label className="cursor-pointer pr-4 underline">Reset password</label>
          </Link>
        </div>

        <div className="flex justify-center py-2">
          <Link href={'/registration'}>
            <label className="cursor-pointer pr-4 underline">No account yet?</label>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Login;
