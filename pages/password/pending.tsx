import { NextPage } from 'next';
import TextButton from '@/components/common/TextButton';
import Link from 'next/link';

const PasswordResetRequestPending: NextPage = () => {
  return (
    <>
      <div className={'flex h-screen columns-1 flex-col items-center justify-center'}>
        <div className="m-2">Check your mail</div>
        <div>A reset link for was sent to you</div>

        <div className="m-2 flex justify-center py-2">
          <Link href="/">
            <TextButton text="Back home" />
          </Link>
        </div>
      </div>
    </>
  );
};

export default PasswordResetRequestPending;
