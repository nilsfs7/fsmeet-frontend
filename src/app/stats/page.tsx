import Navigation from '@/components/Navigation';
import PageTitle from '@/components/PageTitle';
import NavigateBackButton from '@/components/NavigateBackButton';
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
