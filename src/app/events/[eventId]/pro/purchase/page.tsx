import ActionButton from '@/components/common/action-button';
import Navigation from '@/components/navigation';
import PageTitle from '@/components/page-title';
import { routeEvents } from '@/domain/constants/routes';
import { Action } from '@/domain/enums/action';
import { getTranslations } from 'next-intl/server';
import { auth } from '@/auth';
import { getEvent, getEventLicenseInfo } from '@/infrastructure/clients/event.client';
import { LicenseType } from '@/domain/enums/license-type';
import { convertCurrencyIntegerToDecimal } from '@/functions/currency-conversion';
import { getCurrencySymbol } from '@/functions/get-currency-symbol';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ProLicensePurchaseClient } from './components/pro-license-purchase-client';

const constrainedContentClass = 'mx-auto w-full max-w-3xl min-w-0 px-3 sm:px-4';

export default async function EventProLicensePurchase(props: { params: Promise<{ eventId: string }> }) {
  const params = await props.params;
  const [t, session] = await Promise.all([getTranslations('/events/eventid/pro/purchase'), auth()]);
  const event = await getEvent(params.eventId, session);

  const alreadyPro = event.licenseType === LicenseType.PRO;

  let formattedLicensePrice: string = 'error';
  if (!alreadyPro) {
    try {
      const licenseInfo = await getEventLicenseInfo(params.eventId, session);
      formattedLicensePrice = `${convertCurrencyIntegerToDecimal(licenseInfo.price, event.currency).toFixed(2).replace('.', ',')} ${getCurrencySymbol(event.currency)}`;
    } catch {}
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className={constrainedContentClass}>
        <PageTitle title={t('pageTitle')} />
      </div>

      <div className={cn('mt-2 min-h-0 flex-1 overflow-y-auto', constrainedContentClass)}>
        {alreadyPro && (
          <Alert className="mb-4">
            <AlertDescription className="flex flex-col gap-3">
              <span>{t('alreadyPro')}</span>
              <Button asChild variant="outline" size="sm" className="self-start">
                <Link href={`${routeEvents}/${params.eventId}/pro`}>{t('btnBackToComparison')}</Link>
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {!alreadyPro && <ProLicensePurchaseClient eventId={event.id ?? params.eventId} eventName={event.name} formattedLicensePrice={formattedLicensePrice} />}
      </div>

      <Navigation>
        <ActionButton href={`${routeEvents}/${params.eventId}/pro`} action={Action.BACK} />
      </Navigation>
    </div>
  );
}
