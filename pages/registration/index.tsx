import { NextPage } from 'next';
import { useState } from 'react';
import TextButton from '@/components/common/TextButton';
import TextInput from '@/components/common/TextInput';
import bcrypt from 'bcryptjs';
import router from 'next/router';
import ErrorMessage from '@/components/ErrorMessage';
import { validateFirstName } from '@/types/funcs/validation/validation-user';

const Register: NextPage = () => {
  const [firstName, setFirstName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleInputChangeFirstName = (event: any) => {
    let firstName: string = event.currentTarget.value;
    firstName = firstName.trimStart();
    firstName = firstName.replaceAll('  ', ' ');

    if (firstName.length > 0) {
      const firstChar = firstName.charAt(0).toUpperCase();
      if (firstName.length === 1) {
        firstName = firstChar;
      } else {
        firstName = firstChar + firstName.slice(1).toLowerCase();
      }
    }

    if (validateFirstName(firstName)) {
      setFirstName(firstName);
    }
  };

  const handleInputChangeUsername = (event: any) => {
    const uname: string = event.currentTarget.value;
    setUsername(uname.toLowerCase());
  };

  const handleInputChangeEmail = (event: any) => {
    const email: string = event.currentTarget.value;
    setEmail(email.toLowerCase());
  };

  const handleInputChangePassword = (event: any) => {
    const hashedPassword = bcrypt.hashSync(event.currentTarget.value, '$2a$10$CwTycUXWue0Thq9StjUM0u');
    setPassword(hashedPassword);
  };

  const handleInputKeypressPassword = (e: any) => {
    if (e.keyCode === 13) {
      handleCreateClicked();
    }
  };

  const handleCreateClicked = async () => {
    setError('');

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/users`, {
      method: 'POST',
      body: JSON.stringify({ username: username, email: email, password: password, firstName: firstName.trim() }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status == 201) {
      router.replace(`registration/pending?username=${username}&email=${email}`);
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
            id={'firstName'}
            label={'First name'}
            placeholder="Max"
            value={firstName}
            onChange={e => {
              handleInputChangeFirstName(e);
            }}
          />

          <TextInput
            id={'username'}
            label={'Username'}
            placeholder="max"
            value={username}
            onChange={e => {
              handleInputChangeUsername(e);
            }}
          />
          <TextInput
            id={'email'}
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

        <ErrorMessage message={error} />
      </div>
    </>
  );
};

export default Register;
