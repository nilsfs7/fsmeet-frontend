import Navigation from '@/components/navigation';
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

  return (
    <div className="min-h-0 flex-1 flex flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <PageInset className="flex flex-col gap-8 pb-6 pt-4 sm:gap-10 sm:pt-6">
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-heading-1">{t('pageTitle')}</h1>
            <p className="max-w-[44rem] text-balance text-sm text-muted-foreground sm:text-base">{t('pageDescription')}</p>
          </div>

          <ContributorsTable title={t('sectionMainContributors')} rows={mainRows} colContribution={t('tableColContribution')} lnkAnnouncement={t('lnkAnnouncement')} />
          <ContributorsTable
            title={t('sectionCommunityProposals')}
            description={t('sectionCommunityProposalsText')}
            rows={communityRows}
            colContribution={t('tableColProposal')}
            lnkAnnouncement={t('lnkAnnouncement')}
          />
        </PageInset>
      </div>

      <Navigation>
        <ActionButton href={routeAbout} action={Action.BACK} />
      </Navigation>
    </div>
  );
}
