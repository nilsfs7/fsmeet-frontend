import Navigation from '@/components/navigation';
import PageTitle from '@/components/page-title';
import NavigateBackButton from '@/components/navigate-back-button';
import { Statistics } from './components/statistics';

export default async function StatisticsOverview() {
  return (
    <div className="h-[calc(100dvh)] flex flex-col">
      <PageTitle title="Statistics" />

      <Statistics />

      <Navigation>
        <NavigateBackButton />
      </Navigation>
    </div>
  );
}
