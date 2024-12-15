import Navigation from '@/components/Navigation';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { routeVoice, routeVoiceManage } from '@/domain/constants/routes';
import { auth } from '@/auth';
import { getTranslations } from 'next-intl/server';
import { getPolls } from '@/infrastructure/clients/poll.client';
import PageTitle from '@/components/PageTitle';
import { Action } from '@/domain/enums/action';
import ActionButton from '@/components/common/ActionButton';
import { TextButtonCreatePoll } from './components/text-button-create-poll';

export default async function ManagePolls() {
  const t = await getTranslations('/voice/manage');
  const session = await auth();

  const polls = await getPolls();

  return (
    <div className="h-[calc(100dvh)] flex flex-col">
      <Header />

      <PageTitle title={t('pageTitle')} />

      <div className="mx-2 flex flex-col overflow-auto">
        <div className="mt-6 flex justify-center"></div>
      </div>

      <Navigation>
        <Link href={routeVoice}>
          <ActionButton action={Action.BACK} />
        </Link>

        <Link href={routeVoiceManage}>
          <TextButtonCreatePoll />
        </Link>
      </Navigation>
    </div>
  );
}
