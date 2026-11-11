import Navigation from '@/components/navigation';
import PageTitle from '@/components/page-title';
import ActionButton from '@/components/common/action-button';
import { routeAbout } from '@/domain/constants/routes';
import { Action } from '@/domain/enums/action';
import { PageInset } from '@/components/layout/page-inset';
import { TermsOfServiceText } from '@/app/terms/components/terms-of-service-text';
import { getTranslations } from 'next-intl/server';

export default async function TermsPage() {
  const t = await getTranslations('/terms');
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageTitle title={t('pageTitle')} />

      <PageInset variant="prose" className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto scrollbar-none">
        <TermsOfServiceText />
      </PageInset>

      <Navigation>
        <ActionButton href={routeAbout} action={Action.BACK} />
      </Navigation>
    </div>
  );
}
