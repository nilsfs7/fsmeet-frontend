import { NextPage } from 'next';
import { useState } from 'react';
import Button from '@/components/common/Button';
import router from 'next/router';
import Link from 'next/link';
import { setCookie } from 'cookies-next';

const Login: NextPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleInputChangeUsername = (event: any) => {
    setUsername(event.target.value);
  };
  const handleInputChangePassword = (event: any) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ username: username, password: password }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const body = await response.json();
    if (body.accessToken) {
      setCookie('jwt', body.accessToken, { path: '/' });

      // router.push(`/`);
      router.replace('/');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="flex h-screen columns-2 flex-col justify-center">
          <div className="flex justify-center py-2">
            <label className="pr-4">User:</label>
            <input type="text" required minLength={2} value={username} className="" onChange={handleInputChangeUsername} />
          </div>

          <div className="flex justify-center py-2">
            <label className="pr-4">Password:</label>
            <input type="text" required minLength={2} value={password} className="" onChange={handleInputChangePassword} />
          </div>

          <div className="flex justify-center py-2">
            <Link href={'/register'}>
              <label className="cursor-pointer pr-4 underline">No account yet?</label>
            </Link>
          </div>

          <div className="flex justify-center py-2">
            <Button text="Login" />
          </div>
        </div>
      </form>
    </>
  );
};

export default Login;
