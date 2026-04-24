import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import Link from 'next/link';
import { imgMailIncoming } from '@/domain/constants/images';
import Image from 'next/image';
import { routeHome } from '@/domain/constants/routes';
import { getTranslations } from 'next-intl/server';

export default async function RegistrationPending(props: { searchParams: Promise<{ email: string }> }) {
  const t = await getTranslations('/registration/pending');
  const searchParams = await props.searchParams;

  return (
    <div className="min-h-0 flex-1 flex flex-col">
      <div className="p-2 h-full grid overflow-y-auto">
        <div className={'h-full flex flex-col items-center justify-center'}>
          <div className="mx-2 text-center">
            <Image src={imgMailIncoming} width={0} height={0} sizes="100vw" className={`h-12 w-full`} alt={'image'} />

            <div>{`${t('registrationPendingText1')} ${searchParams.email}`}</div>
            <div>{t('registrationPendingText2')}</div>

            <div className="mt-2">
              <Button asChild variant="action" className={ctaActionButtonClassName}>
                <Link href={routeHome}>{t('btnBackHome')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
