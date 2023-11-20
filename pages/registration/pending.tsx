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
        <div className="mx-2 text-center">
          A confirmation link for {username} was sent to {email}.
        </div>
        <div className="mx-2 text-center">{`It may take some minutes until your mail is delivered. Also check your spam if you didn't receive anything.`}</div>

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
