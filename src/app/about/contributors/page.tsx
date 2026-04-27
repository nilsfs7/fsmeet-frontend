import { Header } from '@/components/header';
import Navigation from '@/components/navigation';
import PageTitle from '@/components/page-title';
import ActionButton from '@/components/common/action-button';
import { routeAbout } from '@/domain/constants/routes';
import { Action } from '@/domain/enums/action';
import { getUser } from '@/infrastructure/clients/user.client';
import { User } from '@/domain/types/user';
import { getTranslations } from 'next-intl/server';
import { PageInset } from '@/components/layout/page-inset';
import { ContributorsTable, type ContributorsTableRow } from './components/contributors-table';

async function getUserOptional(username: string): Promise<User | undefined> {
  try {
    return await getUser(username);
  } catch {
    return undefined;
  }
}

export default async function Contributors() {
  const t = await getTranslations('/about/contributors');

  const [userCbb, userJayVng, userGaby, userMai, userJule, userNikolaj, showballs, userUros, userNils] = await Promise.all([
    getUserOptional('cbb'),
    getUserOptional('jay_vng'),
    getUserOptional('gabymassif'),
    getUserOptional('mai'),
    getUserOptional('jule'),
    getUserOptional('nikolaj.jb'),
    getUserOptional('showballs'),
    getUserOptional('urosfs'),
    getUserOptional('nils'),
  ]);

  const mainRows: ContributorsTableRow[] = [];
  if (userNils) {
    mainRows.push({ user: userNils, contribution: t('textHeadOfDevelopment') });
  }
  if (userUros) {
    mainRows.push({ user: userUros, contribution: t('textMobileAppDevelopment'), instagramPath: 'p/DLzNpvktDG3' });
  }
  if (userNikolaj) {
    mainRows.push({
      user: userNikolaj,
      contribution: t('textSpanishTranslation'),
      instagramPath: 'p/DDEp2gZsB7e',
    });
  }
  if (userJayVng) {
    mainRows.push({
      user: userJayVng,
      contribution: t('textSpanishTranslation'),
      instagramPath: 'p/DDEp2gZsB7e',
    });
  }
  if (userGaby) {
    mainRows.push({
      user: userGaby,
      contribution: t('textFrenchTranslation'),
      instagramPath: 'p/DDP0vnBMLBy',
    });
  }
  if (userMai) {
    mainRows.push({
      user: userMai,
      contribution: t('textJapaneseAndOtherLanguagesTranslation'),
      instagramPath: 'p/DU8QA_XDLXf',
    });
  }
  if (showballs) {
    mainRows.push({
      user: showballs,
      contribution: t('textUxAdvisor'),
    });
  }

  const communityRows: ContributorsTableRow[] = [];
  if (userCbb) {
    communityRows.push({
      user: userCbb,
      contribution: t('textPersonalSchedule'),
      instagramPath: 'p/C4P5MiQr9Uj',
    });
  }
  if (userJule) {
    communityRows.push({
      user: userJule,
      contribution: t('textSearchByGender'),
      instagramPath: 'p/C5scnaRrIo9',
    });
  }

  const colName = t('tableColName');
  const colContribution = t('tableColContribution');
  const colProposal = t('tableColProposal');
  const colAnnouncement = t('tableColAnnouncement');
  const noAnnouncement = t('tableNoAnnouncement');

  return (
    <div className="min-h-0 flex-1 flex flex-col">
      <Header />

      <PageTitle title={t('pageTitle')} />

      <PageInset variant="prose" className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto">
        <div className="flex w-full min-w-0 flex-col items-center gap-6 text-center sm:gap-8">
          <ContributorsTable
            title={t('sectionMainContributors')}
            rows={mainRows}
            colName={colName}
            colContribution={colContribution}
            colAnnouncement={colAnnouncement}
            noAnnouncement={noAnnouncement}
            className="self-center"
          />
          <ContributorsTable
            title={t('sectionCommunityProposals')}
            rows={communityRows}
            colName={colName}
            colContribution={colProposal}
            colAnnouncement={colAnnouncement}
            noAnnouncement={noAnnouncement}
            className="self-center"
          />
        </div>
      </PageInset>

      <Navigation>
        <ActionButton href={routeAbout} action={Action.BACK} />
      </Navigation>
    </div>
  );
}
