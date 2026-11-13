import { Action } from '@/domain/enums/action';
import { routeWffaFreestylerIdManagement, routeHome, routeStatistics, routeVisaRequestManagement } from '@/domain/constants/routes';
import ActionButton from '@/components/common/action-button';
import Navigation from '@/components/navigation';
import PageTitle from '@/components/page-title';
import { getTranslations } from 'next-intl/server';
import { HubLinks } from '@/components/common/hub-links';
import { PageInset } from '@/components/layout/page-inset';
import { IconChartBar, IconId, IconPlaneDeparture } from '@tabler/icons-react';

export default async function AdminOverviewWFFA() {
  const t = await getTranslations('/wffa');

  return (
    <div className="min-h-0 flex-1 flex flex-col">
      <PageTitle title={t('pageTitle')} description={t('pageDescription')} />

      <div className="min-h-0 flex-1 overflow-y-auto">
        <PageInset className="max-w-3xl">
          <HubLinks
            links={[
              { href: routeWffaFreestylerIdManagement, title: t('linkIds'), description: t('linkIdsText'), Icon: IconId },
              {
                href: routeVisaRequestManagement,
                title: t('linkVisa'),
                description: t('linkVisaText'),
                Icon: IconPlaneDeparture,
                tone: 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300',
              },
              {
                href: routeStatistics,
                title: t('linkStatistics'),
                description: t('linkStatisticsText'),
                Icon: IconChartBar,
                tone: 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300',
              },
            ]}
          />
        </PageInset>
      </div>

      <Navigation>
        <ActionButton href={routeHome} action={Action.BACK} />
      </Navigation>
    </div>
  );
}
