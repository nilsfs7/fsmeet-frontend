import TextButton from '@/components/common/TextButton';
import { imgMailIncoming } from '@/domain/constants/images';
import { routeHome } from '@/domain/constants/routes';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';

export default async function PasswordResetRequestPending() {
  const t = await getTranslations('/password/pending');

  return (
    <div className={'absolute inset-0 flex flex-col'}>
      <div className="p-2 h-full grid overflow-y-auto">
        <div className={'h-full flex flex-col justify-center'}>
          <div className="mx-2 text-center">
            <Image src={imgMailIncoming} width={0} height={0} sizes="100vw" className={`h-12 w-full`} alt={'image'} />

            <div>{t('thankYouText1')}</div>
            <div>{t('thankYouText2')}</div>

            <div className="mt-2">
              <Link href={routeHome}>
                <TextButton text={t('btnBackHome')} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
