import TextButton from '@/components/common/TextButton';
import { imgMailIncoming } from '@/domain/constants/images';
import { routeHome } from '@/domain/constants/routes';
import Image from 'next/image';
import Link from 'next/link';

const PasswordResetRequestPending = () => {
  return (
    <div className={'absolute inset-0 flex flex-col'}>
      <div className="p-2 h-full grid overflow-y-auto">
        <div className={'h-full flex flex-col justify-center'}>
          <div className="mx-2 text-center">
            <Image src={imgMailIncoming} width={0} height={0} sizes="100vw" className={`h-12 w-full`} alt={'image'} />

            <div>{`Check your mail`}</div>
            <div>{`A reset link for was sent to you`}</div>

            <div className="mt-2">
              <Link href={routeHome}>
                <TextButton text="Back home" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetRequestPending;
