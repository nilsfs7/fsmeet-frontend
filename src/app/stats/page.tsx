import Navigation from '@/components/navigation';
import PageTitle from '@/components/page-title';
import NavigateBackButton from '@/components/navigate-back-button';
import { Statistics } from './components/statistics';
import { getTranslations } from 'next-intl/server';

export default async function StatisticsOverview() {
  const t = await getTranslations('/stats');
  return (
    <div className="min-h-0 flex-1 flex flex-col">
      <PageTitle title={t('pageTitle')} />

      <Statistics />

      <Navigation>
        <NavigateBackButton />
      </Navigation>
    </div>
  );
}
