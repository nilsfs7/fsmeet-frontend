import TextButton from '@/components/common/TextButton';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { imgMailIncoming } from '@/types/consts/images';
import Image from 'next/image';
import { routeHome } from '@/types/consts/routes';

const RegistrationPending = () => {
  const router = useRouter();
  const { email } = router.query;

  return (
    <div className={'flex h-screen flex-col items-center justify-center'}>
      <div className="mx-2 text-center">
        <Image src={imgMailIncoming} width={0} height={0} sizes="100vw" className={`h-12 w-full`} alt={'image'} />

        <div>{`A confirmation link was sent to ${email}`}.</div>
        <div>{`It may take a while until your mail is delivered. Also check your spam if you didn't receive anything.`}</div>
        <div className="mt-2">
          <Link href={routeHome}>
            <TextButton text="Back home" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPending;
