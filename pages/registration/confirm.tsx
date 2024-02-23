import TextButton from '@/components/common/TextButton';
import Link from 'next/link';
import { routeLogin } from '@/types/consts/routes';
import Image from 'next/image';
import { imgEmojiError, imgCelebration } from '@/types/consts/images';
import { GetServerSidePropsContext } from 'next';

const RegistrationConfirmation = (props: any) => {
  let confirmationSuccessful: boolean = props.data;

  return (
    <div className={'flex h-screen flex-col items-center justify-center'}>
      <div className="mx-2 text-center">
        {confirmationSuccessful ? (
          <Image src={imgCelebration} width={0} height={0} sizes="100vw" className={`h-12 w-full`} alt={''} />
        ) : (
          <Image src={imgEmojiError} width={0} height={0} sizes="100vw" className={`h-12 w-full`} alt={''} />
        )}

        <div className="mt-2">{confirmationSuccessful ? `Registration successful` : `Something went wrong`}</div>
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

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  let confirmationSuccessful = false;

  try {
    // TODO: outsource
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/users/confirm/user?username=${context.query.username}&requestToken=${context.query.requestToken}`, {
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
