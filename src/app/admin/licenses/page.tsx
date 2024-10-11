import { Action } from '@/domain/enums/action';
import Link from 'next/link';
import { routeAdminOverview } from '@/domain/constants/routes';
import ActionButton from '@/components/common/ActionButton';
import Navigation from '@/components/Navigation';
import PageTitle from '@/components/PageTitle';
import { LicensesEditor } from './components/licenses-editor';

export default async function LicenseAdministration() {
  return (
    <div className="h-[calc(100dvh)] flex flex-col">
      <PageTitle title="Manage Licenses" />

      <LicensesEditor />

      <Navigation>
        <Link href={routeAdminOverview}>
          <ActionButton action={Action.BACK} />
        </Link>
      </Navigation>
    </div>
  );
}
