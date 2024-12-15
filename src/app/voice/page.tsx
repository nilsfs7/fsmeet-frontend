import Navigation from '@/components/Navigation';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { routeHome, routeVoiceManage } from '@/domain/constants/routes';
import { getTranslations } from 'next-intl/server';
import { getPolls } from '@/infrastructure/clients/poll.client';
import PageTitle from '@/components/PageTitle';
import { Action } from '@/domain/enums/action';
import ActionButton from '@/components/common/ActionButton';
import { PollsCarousel } from './components/polls-carousel';
import TextButton from '@/components/common/TextButton';

export default async function Voice() {
  const t = await getTranslations('/voice');

  const polls = await getPolls();

  return (
    <div className="h-[calc(100dvh)] flex flex-col">
      <Header />

      <PageTitle title={t('pageTitle')} />

      <div className="mx-2 flex flex-col overflow-auto">
        <div className="mt-6 flex justify-center">
          <PollsCarousel initPolls={polls} />
        </div>
      </div>

      <Navigation>
        <Link href={routeHome}>
          <ActionButton action={Action.BACK} />
        </Link>

        <Link href={routeVoiceManage}>
          <TextButton text={t('btnManagePolls')} />
        </Link>
      </Navigation>
    </div>
  );
}
