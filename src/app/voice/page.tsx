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
import { ColumnInfo, PollsList } from '../../components/polls-list';
import { getUser } from '@/infrastructure/clients/user.client';
import { auth } from '@/auth';
import { User } from '@/types/user';

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
        <div className="mt-2 flex justify-center px-12">
          <PollsCarousel initPolls={polls} actingUser={user} />
        </div>

        <PollsList columnData={columnData} />
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
