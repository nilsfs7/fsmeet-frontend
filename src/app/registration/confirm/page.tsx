import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import Link from 'next/link';
import { routeLogin } from '@/domain/constants/routes';
import Image from 'next/image';
import { imgEmojiError, imgCelebration } from '@/domain/constants/images';
import { createConfirmUser } from '@/infrastructure/clients/user.client';
import { getTranslations } from 'next-intl/server';

export default async function RegistrationConfirmation(props: { searchParams: Promise<{ username: string; requestToken: string }> }) {
  const t = await getTranslations('/registration/confirm');
  const searchParams = await props.searchParams;

  const confirmationSuccessful = await createConfirmUser(searchParams.username, searchParams.requestToken);

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

            <div className="mt-2">{confirmationSuccessful ? t('registrationSuccess') : t('registrationFailure')}</div>

            <div className="mt-2">
              <Button asChild variant="action" className={ctaActionButtonClassName}>
                <Link href={routeLogin}>{t('btnProceed')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
