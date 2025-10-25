import Link from 'next/link';
import { imgThumbsUp } from '@/domain/constants/images';
import { routeEvents, routeHome } from '@/domain/constants/routes';
import Image from 'next/image';
import TextButton from '@/components/common/text-button';
import { getTranslations } from 'next-intl/server';

export default async function ThankYou(props: { params: Promise<{ eventId: string }> }) {
  const params = await props.params;
  const t = await getTranslations('/events/eventid/registration/visa/success');

  return (
    <div className={'absolute inset-0 flex flex-col items-center justify-center'}>
      <div className="py-2">
        <Image src={imgThumbsUp} width={0} height={0} sizes="100vw" className={`h-12 w-full`} alt={'image'} />
        <div className="m-1 text-center text-lg font-bold">
          <div>{t('textSuccess1')}</div>
          <div>{t('textSuccess2')}</div>
        </div>
      </div>

      <div className="py-2">
        <Link href={`${routeEvents}/${params.eventId}/registration`}>
          <TextButton text={t('btnBack')} />
        </Link>
      </div>
    </div>
  );
}
