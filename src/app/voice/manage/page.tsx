import Navigation from '@/components/navigation';
import Link from 'next/link';
import { Header } from '@/components/header';
import { routeVoice, routeVoiceCreatePoll } from '@/domain/constants/routes';
import { auth } from '@/auth';
import { getTranslations } from 'next-intl/server';
import { getPolls } from '@/infrastructure/clients/poll.client';
import PageTitle from '@/components/page-title';
import { Action } from '@/domain/enums/action';
import ActionButton from '@/components/common/action-button';
import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import { ColumnInfo, PollsList } from '../../../components/polls-list';
import { cn } from '@/lib/utils';
import { appShellContentClass } from '@/components/layout/app-shell-content';

const constrainedContentClass = cn(appShellContentClass, 'max-w-content');

export default async function ManagePolls() {
  const [t, session] = await Promise.all([getTranslations('/voice/manage'), auth()]);

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
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <Header />

      <div className={constrainedContentClass}>
        <PageTitle title={t('pageTitle')} />
      </div>

      <div className={cn('mt-2 flex min-h-0 flex-1 min-w-0 flex-col overflow-hidden', constrainedContentClass)}>
        <PollsList columnData={columnData} enableEditing />
      </div>

      <Navigation>
        <ActionButton href={routeVoice} action={Action.BACK} />

        <Button asChild variant="action" className={ctaActionButtonClassName}>
          <Link href={routeVoiceCreatePoll}>{t('btnCreatePoll')}</Link>
        </Button>
      </Navigation>
    </div>
  );
}
