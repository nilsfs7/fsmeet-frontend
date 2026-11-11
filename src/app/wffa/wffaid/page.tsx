import { Action } from '@/domain/enums/action';
import { routeWffaOverview } from '@/domain/constants/routes';
import ActionButton from '@/components/common/action-button';
import Navigation from '@/components/navigation';
import PageTitle from '@/components/page-title';
import { WffaIdEditor } from './components/wffa-id-editor';
import { getUsers } from '../../../infrastructure/clients/user.client';
import { UserType } from '../../../domain/enums/user-type';
import { getTranslations } from 'next-intl/server';

export default async function UserWffaId() {
  const [t, freestylers] = await Promise.all([getTranslations('/wffa/ids'), getUsers(UserType.FREESTYLER)]);

  return (
    <div className="min-h-0 flex-1 flex flex-col">
      <PageTitle title={t('pageTitle')} />

      <WffaIdEditor users={freestylers} />

      <Navigation>
        <ActionButton href={routeWffaOverview} action={Action.BACK} />
      </Navigation>
    </div>
  );
}
