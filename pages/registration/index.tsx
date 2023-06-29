import { NextPage } from 'next';
import { useState } from 'react';
import TextButton from '@/components/common/TextButton';
import TextInput from '@/components/common/TextInput';
import bcrypt from 'bcryptjs';
import router from 'next/router';

const Register: NextPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleInputChangeUsername = (event: any) => {
    const uname: string = event.target.value;
    setUsername(uname.toLowerCase());
  };

  const handleInputChangeEmail = (event: any) => {
    const email: string = event.target.value;
    setEmail(email.toLowerCase());
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
    setError('');

    const responseCreateUser = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/users`, {
      method: 'POST',
      body: JSON.stringify({ username: username, email: email, password: password }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (responseCreateUser.status == 201) {
      router.replace(`registration/pending?username=${username}&email=${email}`);
    } else {
      const error = await responseCreateUser.json();
      setError(error.message);
      console.log(error.message);
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
            id={'mail'}
            label={'E-Mail'}
            placeholder="max@gmail.com"
            value={email}
            onChange={e => {
              handleInputChangeEmail(e);
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
          <TextButton text="Sign Up" onClick={handleCreateClicked} />
        </div>

        {error != '' && (
          <div className="flex justify-center py-2">
            <label className="text-dark-red">{error}</label>
          </div>
        )}
      </div>
    </>
  );
};

export default Register;
