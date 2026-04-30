import { Action } from '@/domain/enums/action';
import ActionButton from '@/components/common/action-button';
import { routeEvents } from '@/domain/constants/routes';
import Navigation from '@/components/navigation';
import PageTitle from '@/components/page-title';
import { getSponsors } from '@/infrastructure/clients/sponsor.client';
import { getTranslations } from 'next-intl/server';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const constrainedContentClass = 'mx-auto w-full max-w-3xl min-w-0 px-3 sm:px-4';

export default async function EventSponsors(props: { params: Promise<{ eventId: string }> }) {
  const params = await props.params;
  const [t, tAccommodation, sponsors] = await Promise.all([
    getTranslations('/events/eventid/sponsors'),
    getTranslations('/events/eventid/accommodations'),
    getSponsors(params.eventId),
  ]);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className={constrainedContentClass}>
        <PageTitle title={t('pageTitle')} />
      </div>

      <div className={cn('mt-2 min-h-0 flex-1 overflow-y-auto', constrainedContentClass)}>
        <div className="flex flex-col gap-3 text-sm">
          <div className="min-h-0 min-w-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{tAccommodation('tableColDescription')}</TableHead>
                  <TableHead className="w-[1%] whitespace-nowrap text-right">{tAccommodation('tableColActions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sponsors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="py-6 text-center text-muted-foreground">
                      {t('textNoSponsors')}
                    </TableCell>
                  </TableRow>
                ) : (
                  sponsors.map((sponsor, index) => (
                    <TableRow key={sponsor.id ?? index}>
                      <TableCell className="font-medium">{sponsor.name}</TableCell>
                      <TableCell className="text-right">
                        <ActionButton
                          href={`${routeEvents}/${params.eventId}/sponsors/${sponsor.id}/edit`}
                          action={Action.EDIT}
                          tooltip={t('tooltipEditSponsor')}
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
          <Link href={`${routeEvents}/${params.eventId}/sponsors/create`}>{t('btnCreate')}</Link>
        </Button>
      </Navigation>
    </div>
  );
}
