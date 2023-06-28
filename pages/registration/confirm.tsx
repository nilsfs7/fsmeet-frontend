import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import TextButton from '@/components/common/TextButton';
import { useRouter } from 'next/router';
import Link from 'next/link';

const RegistrationConfirmation: NextPage = () => {
  const router = useRouter();
  const { username, requestToken } = router.query;

  const [confirmationSuccessful, setConfirmationSuccessful] = useState(false);

  const confirmUser = async () => {
    const responseConfirmUser = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/users/confirm/user?username=${username}&requestToken=${requestToken}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (responseConfirmUser.status == 201) {
      setConfirmationSuccessful(true);
    }
    if (responseConfirmUser.status == 200) {
      setConfirmationSuccessful(true);
    }
  };

  useEffect(() => {
    if (!router.isReady) return;
    // if (!confirmationSuccessful) {

    console.log(username);
    console.log(requestToken);
    confirmUser();

    // }
  }, [[router.isReady]]);

  return (
    <>
      <div className={'flex h-screen columns-1 flex-col items-center justify-center'}>
        {confirmationSuccessful ? <div>Registration successful</div> : <div>Something went worng :(</div>}

        <div className="flex justify-center py-2">
          <Link href="/login">
            <TextButton text="Proceed" />
          </Link>
        </div>
      </div>
    </>
  );
};

export default RegistrationConfirmation;
