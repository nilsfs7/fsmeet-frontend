import { Action } from '@/domain/enums/action';
import ActionButton from '@/components/common/action-button';
import Navigation from '@/components/navigation';
import Separator from '@/components/separator';
import { routeEvents } from '@/domain/constants/routes';
import PageTitle from '@/components/page-title';
import { getTranslations } from 'next-intl/server';
import { getCompetitions } from '@/infrastructure/clients/competition.client';

export default async function ManageCompetitions(props: { params: Promise<{ eventId: string }> }) {
  const params = await props.params;
  const t = await getTranslations('/events/eventid/comps');

  const competitions = await getCompetitions(params.eventId);

  return (
    <div className="min-h-0 flex-1 flex flex-col">
      <PageTitle title={t('pageTitle')} />

      <div className="mx-2 overflow-y-auto">
        <div className={'rounded-lg border border-primary bg-secondary-light p-2 text-sm'}>
          <div className="flex flex-col">
            <>
              {competitions.map((comp, index) => {
                return (
                  <div key={index} className="m-1 flex flex-col gap-1">
                    <div className="flex items-center w-full gap-2">
                      <div className="flex w-1/2 justify-end">{comp.name}</div>
                      <div className="flex w-1/2">
                        <div className="gap-2 flex items-center">
                          <ActionButton
                            href={`${routeEvents}/${params.eventId}/comps/${comp.id}/edit`}
                            action={Action.EDIT}
                          />
                          <div>{t('btnEdit')}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center w-full gap-2">
                      <div className="flex w-1/2 justify-end"></div>
                      <div className="flex w-1/2">
                        <div className="gap-2 flex items-center">
                          <ActionButton
                            href={`${routeEvents}/${params.eventId}/comps/${comp.id}/edit/pool`}
                            action={Action.MANAGE_USERS}
                          />
                          <div>{t('btnPool')}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center w-full gap-2">
                      <div className="flex w-1/2 justify-end"></div>
                      <div className="flex w-1/2">
                        <div className="gap-2 flex items-center">
                          <ActionButton
                            href={`${routeEvents}/${params.eventId}/comps/${comp.id}/edit/mode`}
                            action={Action.MANAGE_COMPETITIONS}
                          />
                          <div>{t('btnGameMode')}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center w-full gap-2">
                      <div className="flex w-1/2 justify-end"></div>
                      <div className="flex w-1/2">
                        <div className="gap-2 flex items-center">
                          <ActionButton
                            href={`${routeEvents}/${params.eventId}/comps/${comp.id}/edit/seeding`}
                            action={Action.MANAGE_USERS}
                          />
                          <div>{t('btnSeedingAndResults')}</div>
                        </div>
                      </div>
                    </div>

                    <div className="my-1">
                      <Separator />
                    </div>
                  </div>
                );
              })}

              <div className="m-1 flex items-center gap-2">
                <div className="flex w-1/2 justify-end">{t('btnAddNew')}</div>
                <div className="flex w-1/2">
                  <ActionButton href={`${routeEvents}/${params.eventId}/comps/create`} action={Action.ADD} />
                </div>
              </div>
            </>
          </div>
        </div>
      </div>

      <Navigation>
        <ActionButton href={`${routeEvents}/${params.eventId}`} action={Action.BACK} />
      </Navigation>
    </div>
  );
}
