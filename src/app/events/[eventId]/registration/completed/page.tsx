import TextButton from '@/components/common/TextButton';
import { imgCelebration } from '@/domain/constants/images';
import { routeEvents } from '@/domain/constants/routes';
import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export default async function EventRegistrationCompleted({ params, searchParams }: { params: { eventId: string }; searchParams: { checkout: string } }) {
  const t = await getTranslations('/events/eventid/registration/completed');

  return (
    <div className={'absolute inset-0 flex flex-col'}>
      <div className="p-2 h-full grid overflow-y-auto">
        <div className={'h-full flex flex-col justify-center'}>
          <div className="mx-2 text-center">
            <Image src={imgCelebration} width={0} height={0} sizes="100vw" className={`h-12 w-full`} alt={''} />
            <div className="mt-2">{t('registrationSuccess')}</div>
            <div className="mt-2">{t(searchParams.checkout === '1' ? `textPaymentCompleted` : `textPaymentOutstanding`)}</div>
            <div className="mt-2">
              <Link href={`${routeEvents}/${params.eventId}`}>
                <TextButton text={t('btnBack')} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
