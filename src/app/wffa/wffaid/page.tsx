import { Action } from '@/domain/enums/action';
import { routeWffaOverview } from '@/domain/constants/routes';
import ActionButton from '@/components/common/action-button';
import Navigation from '@/components/navigation';
import PageTitle from '@/components/page-title';
import { WffaIdEditor } from './components/wffa-id-editor';
import { getUsers } from '../../../infrastructure/clients/user.client';
import { UserType } from '../../../domain/enums/user-type';

export default async function UserWffaId() {
  const freestylers = await getUsers(UserType.FREESTYLER);

  return (
    <div className="min-h-0 flex-1 flex flex-col">
      <PageTitle title="Freestyler ID Management" />

      <WffaIdEditor users={freestylers} />

      <Navigation>
        <ActionButton href={routeWffaOverview} action={Action.BACK} />
      </Navigation>
    </div>
  );
}
