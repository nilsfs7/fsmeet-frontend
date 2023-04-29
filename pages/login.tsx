import { NextPage } from 'next';
import { useState } from 'react';
import Button from '@/components/common/Button';
import Link from 'next/link';
import { getSession, signIn } from 'next-auth/react';
import router from 'next/router';

const Login: NextPage = () => {
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
      handleLoginClicked();
    }
  };

  const handleLoginClicked = async () => {
    await signIn('credentials', { username: username, password: password, redirect: false }).then(async () => {
      const session = await getSession();
      if (session) {
        localStorage.setItem('username', session.user.username);
        if (session.user.imageUrl) {
          localStorage.setItem('imageUrl', session.user.imageUrl);
        }
      } else {
        console.log('user info not set');
      }

      router.replace('/');
    });
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
          <input type="password" required minLength={2} value={password} className="" onChange={handleInputChangePassword} onKeyDown={handleInputKeypressPassword} />
        </div>
        <div className="flex justify-center py-2">
          <Link href={'/register'}>
            <label className="cursor-pointer pr-4 underline">No account yet?</label>
          </Link>
        </div>
        <div className="flex justify-center py-2">
          <Button text="Login" onClick={handleLoginClicked} />
        </div>
      </div>
    </>
  );
};

export default Login;
