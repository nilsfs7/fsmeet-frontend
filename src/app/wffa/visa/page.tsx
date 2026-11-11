import { Action } from '@/domain/enums/action';
import { routeWffaOverview } from '@/domain/constants/routes';
import ActionButton from '@/components/common/action-button';
import Navigation from '@/components/navigation';
import PageTitle from '@/components/page-title';
import { VisaRequestManagement } from './components/visa-request-management';
import { getTranslations } from 'next-intl/server';

export default async function UserWffaId() {
  const t = await getTranslations('/wffa/visa');
  return (
    <div className="min-h-0 flex-1 flex flex-col">
      <PageTitle title={t('pageTitle')} />

      <VisaRequestManagement />

      <Navigation>
        <ActionButton href={routeWffaOverview} action={Action.BACK} />
      </Navigation>
    </div>
  );
}
