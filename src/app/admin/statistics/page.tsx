import { Action } from '@/domain/enums/action';
import Link from 'next/link';
import { routeAdminOverview } from '@/domain/constants/routes';
import ActionButton from '@/components/common/ActionButton';
import Navigation from '@/components/Navigation';
import PageTitle from '@/components/PageTitle';
import { UserStatistics } from './components/user-statistics';

export default async function Statistics() {
  return (
    <div className="h-[calc(100dvh)] flex flex-col">
      <PageTitle title="Statistics" />

      <UserStatistics />

      <Navigation>
        <Link href={routeAdminOverview}>
          <ActionButton action={Action.BACK} />
        </Link>
      </Navigation>
    </div>
  );
}
