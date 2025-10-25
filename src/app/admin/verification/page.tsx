import { Action } from '@/domain/enums/action';
import Link from 'next/link';
import { routeAdminOverview } from '@/domain/constants/routes';
import ActionButton from '@/components/common/action-button';
import Navigation from '@/components/navigation';
import PageTitle from '@/components/page-title';
import { VerificationEditor } from './components/verification-editor';

export default async function UserVerification() {
  return (
    <div className="h-[calc(100dvh)] flex flex-col">
      <PageTitle title="User Verification" />

      <VerificationEditor />

      <Navigation>
        <Link href={routeAdminOverview}>
          <ActionButton action={Action.BACK} />
        </Link>
      </Navigation>
    </div>
  );
}
