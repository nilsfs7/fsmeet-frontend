import { Action } from '@/domain/enums/action';
import Link from 'next/link';
import { routeWffaOverview } from '@/domain/constants/routes';
import ActionButton from '@/components/common/action-button';
import Navigation from '@/components/navigation';
import PageTitle from '@/components/page-title';
import { WffaIdEditor } from './components/wffa-id-editor';

export default async function UserWffaId() {
  return (
    <div className="h-[calc(100dvh)] flex flex-col">
      <PageTitle title="Freestyler ID Management" />

      <WffaIdEditor />

      <Navigation>
        <Link href={routeWffaOverview}>
          <ActionButton action={Action.BACK} />
        </Link>
      </Navigation>
    </div>
  );
}
