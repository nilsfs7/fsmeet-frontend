import { NextPage } from 'next';
import { useState } from 'react';
import Button from '@/components/common/Button';
import router from 'next/router';
import { getSession, signIn } from 'next-auth/react';

const Register: NextPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleInputChangeUsername = (event: any) => {
    setUsername(event.target.value);
  };

  const handleInputChangePassword = (event: any) => {
    setPassword(event.target.value);
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
          console.log('user info not set');
        }
      });
    }
  };

  return (
    <>
      <div className="flex h-screen columns-2 flex-col justify-center">
        <div className="flex justify-center py-2">
          <label className="pr-4">User:</label>
          <input type="text" autoFocus required minLength={2} value={username} className="" onChange={handleInputChangeUsername} />
        </div>

        <div className="flex justify-center py-2">
          <label className="pr-4">Password:</label>
          <input type="text" required minLength={2} value={password} className="" onChange={handleInputChangePassword} onKeyDown={handleInputKeypressPassword} />
        </div>
        <div className="flex justify-center py-2">
          <Button text="Create Account" onClick={handleCreateClicked} />
        </div>
      </div>
    </>
  );
};

export default Register;
