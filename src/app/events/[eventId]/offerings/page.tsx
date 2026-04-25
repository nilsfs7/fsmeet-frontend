import { Action } from '@/domain/enums/action';
import ActionButton from '@/components/common/action-button';
import { routeEvents } from '@/domain/constants/routes';
import Navigation from '@/components/navigation';
import PageTitle from '@/components/page-title';
import { getOfferings } from '@/infrastructure/clients/offering.client';
import { getTranslations } from 'next-intl/server';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { auth } from '@/auth';
import { getEvent } from '@/infrastructure/clients/event.client';
import { getCurrencySymbol } from '@/functions/get-currency-symbol';
import { convertCurrencyIntegerToDecimal } from '@/functions/currency-conversion';

const constrainedContentClass = 'mx-auto w-full max-w-3xl min-w-0 px-3 sm:px-4';

export default async function EventOffering(props: { params: Promise<{ eventId: string }> }) {
  const params = await props.params;
  const t = await getTranslations('/events/eventid/offerings');
  const tAccommodation = await getTranslations('/events/eventid/accommodations');
  const session = await auth();

  const event = await getEvent(params.eventId, session);
  const offerings = await getOfferings(params.eventId);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className={cn('mt-2', constrainedContentClass)}>
        <PageTitle title={t('pageTitle')} />
      </div>

      <div className={cn('mt-2 min-h-0 flex-1 overflow-y-auto', constrainedContentClass)}>
        <div className="flex flex-col gap-3 text-sm">
          <div className="min-h-0 min-w-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{tAccommodation('tableColDescription')}</TableHead>
                  <TableHead className="whitespace-nowrap">
                    {tAccommodation('tableColCost')} ({getCurrencySymbol(event.currency)})
                  </TableHead>
                  <TableHead className="w-[1%] whitespace-nowrap text-right">{tAccommodation('tableColActions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {offerings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="py-6 text-center text-muted-foreground">
                      {t('textNoOfferings')}
                    </TableCell>
                  </TableRow>
                ) : (
                  offerings.map((offering, index) => (
                    <TableRow key={offering.id ?? index}>
                      <TableCell className="font-medium">{offering.description}</TableCell>
                      <TableCell className="whitespace-nowrap">{convertCurrencyIntegerToDecimal(offering.cost, event.currency)}</TableCell>
                      <TableCell className="text-right">
                        <ActionButton
                          href={`${routeEvents}/${params.eventId}/offerings/${offering.id}/edit`}
                          action={Action.EDIT}
                          tooltip={t('tooltipEditOffering')}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <Navigation>
        <ActionButton href={`${routeEvents}/${params.eventId}`} action={Action.BACK} />
        <Button asChild variant="action" className={ctaActionButtonClassName}>
          <Link href={`${routeEvents}/${params.eventId}/offerings/create`}>{t('btnCreate')}</Link>
        </Button>
      </Navigation>
    </div>
  );
}
