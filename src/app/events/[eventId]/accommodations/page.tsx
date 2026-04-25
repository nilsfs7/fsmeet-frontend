import { Action } from '@/domain/enums/action';
import ActionButton from '@/components/common/action-button';
import { routeEvents } from '@/domain/constants/routes';
import Navigation from '@/components/navigation';
import PageTitle from '@/components/page-title';
import { getAccommodations } from '@/infrastructure/clients/accommodation.client';
import { getTranslations } from 'next-intl/server';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { convertCurrencyIntegerToDecimal } from '@/functions/currency-conversion';
import { getEvent } from '@/infrastructure/clients/event.client';
import { auth } from '@/auth';
import { getCurrencySymbol } from '@/functions/get-currency-symbol';
import Link from 'next/link';
import { Button, ctaActionButtonClassName } from '@/components/ui/button';

const eventDetailsContentClass = 'mx-auto w-full max-w-3xl min-w-0 px-3 sm:px-4';

export default async function EventAccommodation(props: { params: Promise<{ eventId: string }> }) {
  const params = await props.params;
  const t = await getTranslations('/events/eventid/accommodations');
  const session = await auth();

  const event = await getEvent(params.eventId, session);
  const accommodations = await getAccommodations(params.eventId);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className={cn('mt-2', eventDetailsContentClass)}>
        <PageTitle title={t('pageTitle')} />
      </div>

      <div className={cn('mt-2 min-h-0 flex-1 overflow-y-auto', eventDetailsContentClass)}>
        <div className="flex flex-col gap-3 text-sm">
          <div className="min-h-0 min-w-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('tableColDescription')}</TableHead>
                  <TableHead className="whitespace-nowrap">
                    {t('tableColCost')} ({getCurrencySymbol(event.currency)})
                  </TableHead>
                  <TableHead className="w-[1%] whitespace-nowrap text-right">{t('tableColActions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accommodations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="py-6 text-center text-muted-foreground">
                      {t('textNoAccommodations')}
                    </TableCell>
                  </TableRow>
                ) : (
                  accommodations.map((accommodation, index) => (
                    <TableRow key={accommodation.id ?? index}>
                      <TableCell className="font-medium">{accommodation.description}</TableCell>
                      <TableCell className="whitespace-nowrap">{convertCurrencyIntegerToDecimal(accommodation.cost, event.currency)}</TableCell>
                      <TableCell className="text-right">
                        <ActionButton
                          href={`${routeEvents}/${params.eventId}/accommodations/${accommodation.id}/edit`}
                          action={Action.EDIT}
                          tooltip={t('tooltipEditAccommodation')}
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
          <Link href={`${routeEvents}/${params.eventId}/accommodations/create`}>{t('btnCreate')}</Link>
        </Button>
      </Navigation>
    </div>
  );
}
