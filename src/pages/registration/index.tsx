import { useState } from 'react';
import TextButton from '@/components/common/TextButton';
import TextInput from '@/components/common/TextInput';
import bcrypt from 'bcryptjs';
import router from 'next/router';
import ErrorMessage from '@/components/ErrorMessage';
import { validateFirstName } from '@/types/funcs/validation/validation-user';
import { routeLogin, routeRegistrationPending } from '@/types/consts/routes';
import { createUser } from '@/services/fsmeet-backend/create-user';
import Navigation from '@/components/Navigation';
import Link from 'next/link';
import { Action } from '@/types/enums/action';
import ActionButton from '@/components/common/ActionButton';

const Register = () => {
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
    setUsername(uname.toLowerCase().trim());
  };

  const handleInputChangeEmail = (event: any) => {
    const email: string = event.currentTarget.value;
    setEmail(email.toLowerCase().trim());
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

    try {
      await createUser(username, email, password, firstName);
      router.replace(`${routeRegistrationPending}?username=${username}&email=${email}`);
    } catch (error: any) {
      setError(error.message);
      console.error(error.message);
    }
  };

  return (
    <div className={'absolute inset-0 flex flex-col'}>
      <div className="p-2 h-full grid overflow-y-auto">
        <div className="h-full flex flex-col items-center justify-center">
          <div className="m-2 flex flex-col rounded-lg bg-secondary-light p-1 ">
            <TextInput
              id={'firstName'}
              label={'First name'}
              placeholder="Max"
              value={firstName}
              onChange={(e) => {
                handleInputChangeFirstName(e);
              }}
            />

            <TextInput
              id={'username'}
              label={'Username'}
              placeholder="max"
              value={username}
              onChange={(e) => {
                handleInputChangeUsername(e);
              }}
            />
            <TextInput
              id={'email'}
              label={'E-Mail'}
              placeholder="max@gmail.com"
              value={email}
              onChange={(e) => {
                handleInputChangeEmail(e);
              }}
            />
            <TextInput
              id={'password'}
              type={'password'}
              label={'Password'}
              placeholder="Ball&Chill2021"
              onChange={(e) => {
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
      </div>

      <Navigation>
        <Link href={routeLogin}>
          <ActionButton action={Action.BACK} />
        </Link>
      </Navigation>
    </div>
  );
};

export default Register;
