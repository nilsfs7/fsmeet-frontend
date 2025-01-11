import Navigation from '@/components/Navigation';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { routeVoice, routeVoiceCreatePoll } from '@/domain/constants/routes';
import { auth } from '@/auth';
import { getTranslations } from 'next-intl/server';
import { getPolls } from '@/infrastructure/clients/poll.client';
import PageTitle from '@/components/PageTitle';
import { Action } from '@/domain/enums/action';
import ActionButton from '@/components/common/ActionButton';
import TextButton from '@/components/common/TextButton';
import { ColumnInfo, PollsList } from '../../../components/polls-list';

export default async function ManagePolls() {
  const t = await getTranslations('/voice/manage');
  const session = await auth();

  const polls = await getPolls(session?.user?.username);

  const columnData: ColumnInfo[] = [];

  polls.forEach(poll => {
    columnData.push({
      pollId: poll.id || '',
      user: {
        username: poll.questioner.username,
        imageUrl: poll.questioner.imageUrl || '',
        firstName: poll.questioner.firstName || '',
        lastName: poll.questioner.lastName || '',
      },
      question: poll.question,
      totalRatingScore: poll.totalRatingScore,
      deadline: poll.deadline,
      creationDate: poll.creationTime,
    });
  });

  return (
    <div className="h-[calc(100dvh)] flex flex-col">
      <Header />

      <PageTitle title={t('pageTitle')} />

      <div className="mx-2 flex flex-col overflow-auto">
        <PollsList columnData={columnData} enableEditing />
      </div>

      <Navigation>
        <Link href={routeVoice}>
          <ActionButton action={Action.BACK} />
        </Link>

        <Link href={routeVoiceCreatePoll}>
          <TextButton text={t('btnCreatePoll')} />
        </Link>
      </Navigation>
    </div>
  );
}
