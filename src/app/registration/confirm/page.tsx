import TextButton from '@/components/common/TextButton';
import Link from 'next/link';
import { routeLogin } from '@/domain/constants/routes';
import Image from 'next/image';
import { imgEmojiError, imgCelebration } from '@/domain/constants/images';
import { getConfirmUser } from '@/infrastructure/clients/user.client';

export default async function RegistrationConfirmation({ searchParams }: any) {
  const confirmationSuccessful = await getConfirmUser(searchParams.username, searchParams.requestToken);

  return (
    <div className={'absolute inset-0 flex flex-col'}>
      <div className="p-2 h-full grid overflow-y-auto">
        <div className={'h-full flex flex-col justify-center'}>
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
      </div>
    </div>
  );
}
