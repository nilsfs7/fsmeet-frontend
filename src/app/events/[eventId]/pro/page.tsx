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
import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import { IconCheck, IconX } from '@tabler/icons-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const constrainedContentClass = 'mx-auto w-full max-w-3xl min-w-0 px-3 sm:px-4';

export default async function EventProLicense(props: { params: Promise<{ eventId: string }> }) {
  const params = await props.params;
  const [t, session] = await Promise.all([getTranslations('/events/eventid/pro'), auth()]);
  const event = await getEvent(params.eventId, session);

  let proPriceFormatted: string | undefined;
  try {
    const licenseInfo = await getEventLicenseInfo(params.eventId, session);
    proPriceFormatted = `${convertCurrencyIntegerToDecimal(licenseInfo.price, event.currency)} ${getCurrencySymbol(event.currency)}`;
  } catch {
    proPriceFormatted = undefined;
  }

  const freePriceFormatted = `${convertCurrencyIntegerToDecimal(0, event.currency)} ${getCurrencySymbol(event.currency)}`;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className={constrainedContentClass}>
        <PageTitle title={t('pageTitle')} />
      </div>

      <div className={cn('mt-2 min-h-0 flex-1 overflow-y-auto', constrainedContentClass)}>
        <div className="flex flex-col gap-4 pb-4 text-sm">
          <p className="text-muted-foreground">{t('pageIntro')}</p>

          {event.licenseType === LicenseType.PRO && (
            <Alert>
              <AlertDescription>{t('alreadyPro')}</AlertDescription>
            </Alert>
          )}

          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full min-w-[min(100%,22rem)] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th scope="col" className="p-3 text-left font-semibold text-foreground">
                    {t('featureColumn')}
                  </th>
                  <th scope="col" className="p-3 text-center font-semibold text-foreground">
                    {t('colFree')}
                  </th>
                  <th scope="col" className="p-3 text-center font-semibold text-foreground">
                    {t('colPro')}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="p-3 text-foreground">{t('rowPriceLabel')}</td>
                  <td className="p-3 text-center align-middle tabular-nums text-foreground">{freePriceFormatted}</td>
                  <td className="p-3 text-center align-middle tabular-nums text-foreground">
                    {proPriceFormatted != null && proPriceFormatted !== '' ? proPriceFormatted : <span className="text-muted-foreground">—</span>}
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 text-foreground">{t('rowCoreLabel')}</td>
                  <td className="p-3 text-center align-middle">
                    <IconCheck className="mx-auto h-5 w-5 text-success" stroke={2} aria-label={t('included')} />
                  </td>
                  <td className="p-3 text-center align-middle">
                    <IconCheck className="mx-auto h-5 w-5 text-success" stroke={2} aria-label={t('included')} />
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 text-foreground">{t('rowPaymentsLabel')}</td>
                  <td className="p-3 text-center align-middle">
                    <IconCheck className="mx-auto h-5 w-5 text-success" stroke={2} aria-label={t('included')} />
                  </td>
                  <td className="p-3 text-center align-middle">
                    <IconCheck className="mx-auto h-5 w-5 text-success" stroke={2} aria-label={t('included')} />
                  </td>
                </tr>
                <tr>
                  <td className="p-3 text-foreground">{t('rowArenaLabel')}</td>
                  <td className="p-3 text-center align-middle">
                    <IconX className="mx-auto h-5 w-5 text-muted-foreground" stroke={2} aria-label={t('notIncluded')} />
                  </td>
                  <td className="p-3 text-center align-middle">
                    <IconCheck className="mx-auto h-5 w-5 text-success" stroke={2} aria-label={t('included')} />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {event.licenseType !== LicenseType.PRO && (
            <div className="flex justify-end">
              <Button asChild variant="action" className={ctaActionButtonClassName}>
                <Link href={`${routeEvents}/${event.id ?? params.eventId}/pro/purchase`}>{t('ctaPurchase')}</Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      <Navigation>
        <ActionButton href={`${routeEvents}/${params.eventId}`} action={Action.BACK} />
      </Navigation>
    </div>
  );
}
