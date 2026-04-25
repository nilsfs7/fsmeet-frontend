import { Action } from '@/domain/enums/action';
import ActionButton from '@/components/common/action-button';
import { routeEvents } from '@/domain/constants/routes';
import Navigation from '@/components/navigation';
import PageTitle from '@/components/page-title';
import { getTranslations } from 'next-intl/server';
import { getAttachments } from '@/infrastructure/clients/attachment.client';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const eventDetailsContentClass = 'mx-auto w-full max-w-3xl min-w-0 px-3 sm:px-4';

export default async function EventAttachments(props: { params: Promise<{ eventId: string }> }) {
  const params = await props.params;
  const t = await getTranslations('/events/eventid/attachments');
  const tAccommodation = await getTranslations('/events/eventid/accommodations');

  const attachments = await getAttachments(params.eventId);

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
                  <TableHead>{tAccommodation('tableColDescription')}</TableHead>
                  <TableHead className="w-[1%] whitespace-nowrap text-right">{tAccommodation('tableColActions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attachments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="py-6 text-center text-muted-foreground">
                      {t('textNoAttachments')}
                    </TableCell>
                  </TableRow>
                ) : (
                  attachments.map((attachment, index) => (
                    <TableRow key={attachment.id ?? index}>
                      <TableCell className="font-medium">{attachment.name}</TableCell>
                      <TableCell className="text-right">
                        <ActionButton href={`${routeEvents}/${params.eventId}/attachments/${attachment.id}/edit`} action={Action.EDIT} tooltip={t('tooltipEditDocument')} />
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
          <Link href={`${routeEvents}/${params.eventId}/attachments/create`}>{t('btnCreate')}</Link>
        </Button>
      </Navigation>
    </div>
  );
}
