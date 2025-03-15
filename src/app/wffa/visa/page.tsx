import { Action } from '@/domain/enums/action';
import Link from 'next/link';
import { routeWffaOverview } from '@/domain/constants/routes';
import ActionButton from '@/components/common/ActionButton';
import Navigation from '@/components/Navigation';
import PageTitle from '@/components/PageTitle';
import { VisaRequestManagement } from './components/visa-request-management';

export default async function UserWffaId() {
  return (
    <div className="h-[calc(100dvh)] flex flex-col">
      <PageTitle title="Visa Request Management" />

      <VisaRequestManagement />

      <Navigation>
        <Link href={routeWffaOverview}>
          <ActionButton action={Action.BACK} />
        </Link>
      </Navigation>
    </div>
  );
}
