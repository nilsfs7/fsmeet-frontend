import { Action } from '@/domain/enums/action';
import ActionButton from '@/components/common/ActionButton';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Separator from '@/components/Seperator';
import { routeEvents } from '@/domain/constants/routes';
import PageTitle from '@/components/PageTitle';
import { getEvent } from '@/infrastructure/clients/event.client';
import { getTranslations } from 'next-intl/server';
import { auth } from '@/auth';

export default async function ManageCompetitions({ params }: { params: { eventId: string } }) {
  const t = await getTranslations('/events/eventid/comps');
  const session = await auth();

  const event = await getEvent(params.eventId, session);

  return (
    <div className="h-[calc(100dvh)] flex flex-col">
      <PageTitle title={t('pageTitle')} />

      <div className="mx-2 overflow-y-auto">
        <div className={'rounded-lg border border-primary bg-secondary-light p-2 text-sm'}>
          <div className="flex flex-col">
            <>
              {event?.competitions.map((comp, index) => {
                return (
                  <div key={index} className="m-1 flex flex-col gap-1">
                    <div className="flex items-center w-full gap-2">
                      <div className="flex w-1/2 justify-end">{comp.name}</div>
                      <div className="flex w-1/2">
                        <div className="gap-2 flex items-center">
                          <Link href={`${routeEvents}/${params.eventId}/comps/${comp.id}/edit`}>
                            <ActionButton action={Action.EDIT} />
                          </Link>
                          <div>{t('btnEdit')}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center w-full gap-2">
                      <div className="flex w-1/2 justify-end"></div>
                      <div className="flex w-1/2">
                        <div className="gap-2 flex items-center">
                          <Link href={`${routeEvents}/${params.eventId}/comps/${comp.id}/edit/pool`}>
                            <ActionButton action={Action.MANAGE_USERS} />
                          </Link>
                          <div>{t('btnPool')}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center w-full gap-2">
                      <div className="flex w-1/2 justify-end"></div>
                      <div className="flex w-1/2">
                        <div className="gap-2 flex items-center">
                          <Link href={`${routeEvents}/${params.eventId}/comps/${comp.id}/edit/mode`}>
                            <ActionButton action={Action.MANAGE_COMPETITIONS} />
                          </Link>
                          <div>{t('btnGameMode')}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center w-full gap-2">
                      <div className="flex w-1/2 justify-end"></div>
                      <div className="flex w-1/2">
                        <div className="gap-2 flex items-center">
                          <Link href={`${routeEvents}/${params.eventId}/comps/${comp.id}/edit/seeding`}>
                            <ActionButton action={Action.MANAGE_USERS} />
                          </Link>
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
                  <Link href={`${routeEvents}/${params.eventId}/comps/create`}>
                    <ActionButton action={Action.ADD} />
                  </Link>
                </div>
              </div>
            </>
          </div>
        </div>
      </div>

      <Navigation>
        {/*   <ActionButton action={Action.BACK} onClick={() => router.push(`${routeEvents}/${params.eventId}`)} /> */}
        <Link href={`${routeEvents}/${params.eventId}`}>
          <ActionButton action={Action.BACK} />
        </Link>
      </Navigation>
    </div>
  );
}
