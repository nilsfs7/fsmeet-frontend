import { Action } from '@/domain/enums/action';
import Link from 'next/link';
import { routeWffaFreestylerIdManagement, routeHome, routeStatistics, routeVisaRequestManagement } from '@/domain/constants/routes';
import ActionButton from '@/components/common/action-button';
import Navigation from '@/components/navigation';
import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import PageTitle from '@/components/page-title';
import { getTranslations } from 'next-intl/server';

export default async function AdminOverviewWFFA() {
  const t = await getTranslations('/wffa');

  return (
    <div className="min-h-0 flex-1 flex flex-col">
      <PageTitle title={t('pageTitle')} />

      <div className="mx-2 flex items-center flex-col gap-2">
        <Button asChild variant="action" className={ctaActionButtonClassName}>
          <Link href={routeWffaFreestylerIdManagement}>{t('linkIds')}</Link>
        </Button>

        <Button asChild variant="action" className={ctaActionButtonClassName}>
          <Link href={routeStatistics}>{t('linkStatistics')}</Link>
        </Button>

        <Button asChild variant="action" className={ctaActionButtonClassName}>
          <Link href={routeVisaRequestManagement}>{t('linkVisa')}</Link>
        </Button>
      </div>

      <Navigation>
        <ActionButton href={routeHome} action={Action.BACK} />
      </Navigation>
    </div>
  );
}
