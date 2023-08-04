import { NextPage } from 'next';
import TextButton from '@/components/common/TextButton';
import { useRouter } from 'next/router';
import Link from 'next/link';

const RegistrationPending: NextPage = () => {
  const router = useRouter();
  const { username, email } = router.query;

  return (
    <>
      <div className={'flex h-screen columns-1 flex-col items-center justify-center'}>
        <div className="m-2">Check your mail</div>
        <div>A confirmation link for {username} was sent to</div>
        <div>{email}</div>

        <div className="m-2 flex justify-center py-2">
          <Link href="/">
            <TextButton text="Back home" />
          </Link>
        </div>
      </div>
    </>
  );
};

export default RegistrationPending;
