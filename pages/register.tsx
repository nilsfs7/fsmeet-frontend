import { NextPage } from 'next';
import { useState } from 'react';
import Button from '@/components/common/Button';
import router from 'next/router';
import { setCookie } from 'cookies-next';

const Register: NextPage = () => {
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

    const responseCreateUser = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/users`, {
      method: 'POST',
      body: JSON.stringify({ username: username, password: password }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log(responseCreateUser.status);

    if (responseCreateUser.status == 201) {
      const responseLogin = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/auth/login`, {
        method: 'POST',
        body: JSON.stringify({ username: username, password: password }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const bodyLogin = await responseLogin.json();
      setCookie('jwt', bodyLogin.accessToken);

      router.push(`/`);
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
            <Button text="Create Account" />
          </div>
        </div>
      </form>
    </>
  );
};

export default Register;
