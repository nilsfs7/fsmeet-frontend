import Navigation from '@/components/Navigation';
import PageTitle from '@/components/PageTitle';
import { UserStatistics } from './components/user-statistics';
import NavigateBackButton from '@/components/NavigateBackButton';

export default async function Statistics() {
  return (
    <div className="h-[calc(100dvh)] flex flex-col">
      <PageTitle title="Statistics" />

      <UserStatistics />

      <Navigation>
        <NavigateBackButton />
      </Navigation>
    </div>
  );
}
