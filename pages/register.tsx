import { NextPage } from 'next';
import { useState } from 'react';
import TextButton from '@/components/common/TextButton';
import router from 'next/router';
import { getSession, signIn } from 'next-auth/react';
import TextInput from '@/components/common/TextInput';
import bcrypt from 'bcryptjs';

const Register: NextPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

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
      handleCreateClicked();
    }
  };

  const handleCreateClicked = async () => {
    const responseCreateUser = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/users`, {
      method: 'POST',
      body: JSON.stringify({ username: username, password: password }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (responseCreateUser.status == 201) {
      await signIn('credentials', { username: username, password: password, redirect: false }).then(async () => {
        const session = await getSession();
        if (session) {
          localStorage.setItem('username', session.user.username);
          if (session.user.imageUrl) {
            localStorage.setItem('imageUrl', session.user.imageUrl);
          }

          router.replace('/');
        } else {
          console.error('user info not set');
        }
      });
    }
  };

  return (
    <>
      <div className={'flex h-screen columns-1 flex-col items-center justify-center'}>
        <div className="m-2 flex flex-col rounded-lg bg-zinc-300 p-1">
          <TextInput
            id={'username'}
            label={'User'}
            placeholder="Max"
            value={username}
            onChange={e => {
              handleInputChangeUsername(e);
            }}
          />
          <TextInput
            id={'password'}
            label={'Password'}
            placeholder="123"
            onChange={e => {
              handleInputChangePassword(e);
            }}
            onKeyDown={handleInputKeypressPassword}
          />
        </div>

        <div className="flex justify-center py-2">
          <TextButton text="Sign Up" onClick={handleCreateClicked} />
        </div>
      </div>
    </>
  );
};

export default Register;
