import Navigation from '@/components/navigation';
import Link from 'next/link';
import { Header } from '@/components/header';
import { routeHome, routeVoiceManage } from '@/domain/constants/routes';
import { getTranslations } from 'next-intl/server';
import { getPolls } from '@/infrastructure/clients/poll.client';
import PageTitle from '@/components/page-title';
import { Action } from '@/domain/enums/action';
import ActionButton from '@/components/common/action-button';
import { PollsCarousel } from './components/polls-carousel';
import TextButton from '@/components/common/text-button';
import { ColumnInfo, PollsList } from '../../components/polls-list';
import { getUser } from '@/infrastructure/clients/user.client';
import { auth } from '@/auth';
import { User } from '@/domain/types/user';
import { ActionButtonCopyPollUrl } from './components/action-button-copy-poll-url';

export default async function Voice() {
  const t = await getTranslations('/voice');
  const session = await auth();

  const user: User | undefined = session?.user.username ? await getUser(session?.user.username) : undefined;

  const polls = await getPolls();

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
        <div className="flex justify-center px-12">
          <PollsCarousel initPolls={polls} actingUser={user} />
        </div>

        <div className="mt-2">
          <PollsList columnData={columnData} />
        </div>
      </div>

      <Navigation>
        <Link href={routeHome}>
          <ActionButton action={Action.BACK} />
        </Link>

        <div className="flex justify-end gap-1">
          <ActionButtonCopyPollUrl />

          <Link href={routeVoiceManage}>
            <TextButton text={t('btnManagePolls')} />
          </Link>
        </div>
      </Navigation>
    </div>
  );
}
