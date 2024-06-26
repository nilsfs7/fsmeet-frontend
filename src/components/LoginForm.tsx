'use client';

import { useState } from 'react';
import { RedirectType, redirect, useRouter, useSearchParams } from 'next/navigation';
import { doCredentialLogin } from '@/app/actions';
import bcrypt from 'bcryptjs';
import Link from 'next/link';
import { routeHome, routePasswordForgot, routeRegistration } from '@/types/consts/routes';
import Navigation from './Navigation';
import ActionButton from './common/ActionButton';
import { Action } from '@/types/enums/action';
import TextButton from './common/TextButton';
import TextInput from './common/TextInput';
import { Toaster, toast } from 'sonner';
import router from 'next/router';
import { auth } from '@/auth';
import { getSession } from 'next-auth/react';

export const LoginForm = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const searchParams = useSearchParams();
  const redirectUrl = searchParams?.get('redir');

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
    const response = await doCredentialLogin(usernameOrEmail, password);

    // const response = await signIn('credentials', {
    //   usernameOrEmail: usernameOrEmail,
    //   password: password,
    //   redirect: false,
    // });

    const session = await getSession();

    // if (!response?.status) {

    if (session) {
      localStorage.setItem('username', session.user.username);
      if (session.user.imageUrl) {
        localStorage.setItem('imageUrl', session.user.imageUrl);
      }

      if (redirectUrl) {
        router.replace(redirectUrl);
        // redirect(redirectUrl, RedirectType.replace);
      } else {
        router.replace(routeHome);
        // redirect(routeHome, RedirectType.replace);
      }
    }

    // } else {
    //     let err = 'Unknown error.';
    //     switch (response?.status) {

    //       case 401:
    //         err = 'Wrong username or password.';
    //         toast.error(err);
    //         console.error(err);
    //         break;

    //       default:
    //         toast.error(err);
    //         console.error(err);
    //         break;
    //     }
    //   };
  };

  // const router = useRouter();
  // const [error, setError] = useState("");

  // async function onSubmit(event: any) {
  //     event.preventDefault();
  //     try {
  //         const formData = new FormData(event.currentTarget);
  //         const response = await doCredentialLogin(formData);

  //         if (!!response.error) {
  //             console.error(response.error);
  //             setError(response.error.message);
  //         } else {
  //             router.push("/");
  //         }
  //     } catch (e) {
  //         console.error(e);
  //         setError("Check your Credentials");
  //     }
  // }

  // return (
  //     <>
  //         <div className="text-xl text-red-500">{error}</div>
  //         <form
  //             className="my-5 flex flex-col items-center border p-3 border-gray-200 rounded-md"
  //             onSubmit={onSubmit}>
  //             <div className="my-2">
  //                 <label htmlFor="username">Username</label>
  //                 <input className="border mx-2 border-gray-500 rounded" type="text" name="username" id="username" />
  //             </div>

  //             <div className="my-2">
  //                 <label htmlFor="password">Password</label>
  //                 <input className="border mx-2 border-gray-500 rounded" type="password" name="password" id="password" />
  //             </div>

  //             <button type="submit" className="bg-orange-300 mt-4 rounded flex justify-center items-center w-36">
  //                 Ceredential Login
  //             </button>
  //         </form>

  //     </>
  // );

  return (
    <>
      <Toaster richColors />

      <div className="h-[calc(100dvh)] flex flex-col">
        <div className="p-2 h-full grid overflow-y-auto">
          <div className="h-full flex flex-col items-center justify-center">
            <div className="m-2 flex flex-col rounded-lg bg-secondary-light p-1">
              <TextInput
                id={'usernameOrEmail'}
                label={'Username / Email'}
                placeholder="max"
                value={usernameOrEmail}
                onChange={(e) => {
                  handleInputChangeUsernameOrEmail(e);
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
              <TextButton text="Login" onClick={handleLoginClicked} />
            </div>

            <div className="flex justify-center py-2">
              <Link href={`${routePasswordForgot}`}>
                <label className="cursor-pointer pr-4 underline">{`Reset password`}</label>
              </Link>
            </div>

            <div className="flex justify-center py-2">
              <Link href={`${routeRegistration}`}>
                <label className="cursor-pointer pr-4 underline">{`No account yet?`}</label>
              </Link>
            </div>
          </div>
        </div>

        <Navigation>
          <Link href={routeHome}>
            <ActionButton action={Action.BACK} />
          </Link>
        </Navigation>
      </div>
    </>
  );
};
