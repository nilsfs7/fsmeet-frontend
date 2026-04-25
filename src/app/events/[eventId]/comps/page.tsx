import { Action } from '@/domain/enums/action';
import ActionButton from '@/components/common/action-button';
import NavigateBackButton from '@/components/navigate-back-button';
import Navigation from '@/components/navigation';
import { routeEvents } from '@/domain/constants/routes';
import PageTitle from '@/components/page-title';
import { getTranslations } from 'next-intl/server';
import { getCompetitions } from '@/infrastructure/clients/competition.client';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

const eventDetailsContentClass = 'mx-auto w-full max-w-3xl min-w-0 px-3 sm:px-4';

const actionCellClass = 'p-2 text-center align-middle [&:has([role=button])]:p-2';

export default async function ManageCompetitions(props: { params: Promise<{ eventId: string }> }) {
  const params = await props.params;
  const t = await getTranslations('/events/eventid/comps');
  const competitions = await getCompetitions(params.eventId);
  const base = `${routeEvents}/${params.eventId}/comps`;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className={cn('mt-2', eventDetailsContentClass)}>
        <PageTitle title={t('pageTitle')} />
      </div>

      <div className={cn('mt-2 flex-1 min-h-0 flex flex-col overflow-y-auto', eventDetailsContentClass)}>
        <div className="min-h-0 min-w-0 max-w-full overflow-x-auto text-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[10rem] text-left">{t('tableColCompetition')}</TableHead>
                <TableHead className="w-[1%] whitespace-nowrap text-center">{t('btnEdit')}</TableHead>
                <TableHead className="w-[1%] whitespace-nowrap text-center">{t('btnPool')}</TableHead>
                <TableHead className="w-[1%] whitespace-nowrap text-center">{t('btnGameMode')}</TableHead>
                <TableHead className="w-[1%] min-w-[8rem] whitespace-nowrap text-center">{t('btnSeedingAndResults')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {competitions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-zinc-500 dark:text-zinc-400">
                    {t('textNoCompetitions')}
                  </TableCell>
                </TableRow>
              ) : (
                competitions.map((comp, index) => {
                  const key = comp.id ?? `comp-${index}`;
                  const compBase = `${base}/${comp.id}`;
                  return (
                    <TableRow key={key}>
                      <TableCell className="align-middle font-medium text-zinc-900 dark:text-zinc-100">{comp.name}</TableCell>
                      <TableCell className={actionCellClass}>
                        <div className="inline-flex items-center justify-center">
                          <ActionButton href={`${compBase}/edit`} action={Action.EDIT} tooltip={t('btnEdit')} />
                        </div>
                      </TableCell>
                      <TableCell className={actionCellClass}>
                        <div className="inline-flex items-center justify-center">
                          <ActionButton href={`${compBase}/edit/pool`} action={Action.MANAGE_USERS} tooltip={t('btnPool')} />
                        </div>
                      </TableCell>
                      <TableCell className={actionCellClass}>
                        <div className="inline-flex items-center justify-center">
                          <ActionButton href={`${compBase}/edit/mode`} action={Action.MANAGE_COMPETITIONS} tooltip={t('btnGameMode')} />
                        </div>
                      </TableCell>
                      <TableCell className={actionCellClass}>
                        <div className="inline-flex items-center justify-center">
                          <ActionButton href={`${compBase}/edit/seeding`} action={Action.MANAGE_USERS} tooltip={t('btnSeedingAndResults')} />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell className="text-left text-zinc-600 dark:text-zinc-300">{t('btnAddNew')}</TableCell>
                <TableCell className={actionCellClass}>
                  <div className="inline-flex items-center justify-center">
                    <ActionButton href={`${base}/create`} action={Action.ADD} tooltip={t('btnAddNew')} />
                  </div>
                </TableCell>
                <TableCell className={actionCellClass} />
                <TableCell className={actionCellClass} />
                <TableCell className={actionCellClass} />
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>

      <Navigation>
        <NavigateBackButton />
      </Navigation>
    </div>
  );
}
