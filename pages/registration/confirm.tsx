import { GetServerSideProps, NextPage } from 'next';
import TextButton from '@/components/common/TextButton';
import Link from 'next/link';
import { routeLogin } from '@/types/consts/routes';

const RegistrationConfirmation: NextPage = (props: any) => {
  let confirmationSuccessful: boolean = props.data;

  return (
    <div className={'flex h-screen flex-col items-center justify-center'}>
      <div className="mx-2 text-center">
        <div>{confirmationSuccessful ? `Registration successful` : `Something went worng :(`}</div>

        <div className="mt-2">
          <Link href={routeLogin}>
            <TextButton text="Proceed" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegistrationConfirmation;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  let confirmationSuccessful = false;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/users/confirm/user?username=${query.username}&requestToken=${query.requestToken}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status == 200) {
      confirmationSuccessful = true;
    }
  } catch (error: any) {
    console.error('Error confirming account.');
  }

  return {
    props: {
      data: confirmationSuccessful,
    },
  };
};
