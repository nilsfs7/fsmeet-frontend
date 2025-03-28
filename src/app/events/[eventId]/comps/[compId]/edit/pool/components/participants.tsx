'use client';

import LoadingSpinner from '@/components/animation/loading-spinner';
import ActionButton from '@/components/common/ActionButton';
import UserCard from '@/components/user/UserCard';
import { Action } from '@/domain/enums/action';
import { CompetitionGender } from '@/domain/enums/competition-gender';
import { MaxAge } from '@/domain/enums/max-age';
import { UserType } from '@/domain/enums/user-type';
import { createCompetitionParticipation, deleteCompetitionParticipation, getCompetitionParticipants } from '@/infrastructure/clients/competition.client';
import { getEventRegistrations } from '@/infrastructure/clients/event.client';
import { Competition } from '@/types/competition';
import { EventRegistration } from '@/types/event-registration';
import { EventRegistrationType } from '@/types/event-registration-type';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner';

interface IParticipants {
  competition: Competition;
}

export const Participants = ({ competition }: IParticipants) => {
  const t = useTranslations('/events/eventid/comps/compid/edit/pool');

  const { data: session } = useSession();

  const [eventRegistrations, setEventRegistrations] = useState<EventRegistration[]>();
  const [competitionParticipants, setCompetitionParticipants] = useState<{ username: string }[]>();

  const handleRemoveParticipantClicked = async (compId: string, username: string) => {
    if (competitionParticipants) {
      try {
        await deleteCompetitionParticipation(compId, username, session);

        let newArray = Array.from(competitionParticipants);
        newArray = newArray.filter(registration => {
          return registration.username != username;
        });
        setCompetitionParticipants(newArray);

        toast.success(`${username} removed`);
      } catch (error: any) {
        toast.error(error.message);
        console.error(error.message);
      }
    }
  };

  const handleAddParticipantClicked = async (compId: string, username: string) => {
    if (competitionParticipants) {
      try {
        await createCompetitionParticipation(compId, username, session);

        const newArray = Array.from(competitionParticipants);
        newArray.push({ username: username });
        setCompetitionParticipants(newArray);

        toast.success(`${username} added`);
      } catch (error: any) {
        toast.error(error.message);
        console.error(error.message);
      }
    }
  };

  useEffect(() => {
    async function fetchEventRegistrations() {
      if (competition.eventId) {
        let registrations = await getEventRegistrations(competition.eventId, EventRegistrationType.PARTICIPANT);

        // remove non-freestylers
        registrations = registrations.filter(registration => {
          if (registration.user.type === UserType.FREESTYLER) {
            return registration;
          }
        });

        // remove wrong gender
        if (competition.gender !== CompetitionGender.MIXED) {
          registrations = registrations.filter(registration => {
            if (registration.user.gender === competition.gender.toString()) {
              return registration;
            }
          });
        }

        // remove participants exceeding max age
        if (competition.maxAge !== MaxAge.NONE) {
          registrations = registrations.filter(registration => {
            if (!registration.user.age || registration.user.age <= competition.maxAge) {
              return registration;
            }
          });
        }

        setEventRegistrations(registrations);
      }
    }

    async function fetchCompetitionParticipants() {
      if (competition.id) {
        const participants = await getCompetitionParticipants(competition.id);
        setCompetitionParticipants(participants);
      }
    }

    fetchEventRegistrations();
    fetchCompetitionParticipants();
  }, [eventRegistrations == undefined, competitionParticipants == undefined]);

  if (!eventRegistrations || !competitionParticipants) {
    return <LoadingSpinner text="Loading..." />; // todo
  }

  return (
    <>
      <Toaster richColors />

      <div className={'mx-2 rounded-lg border border-primary bg-secondary-light p-2 overflow-y-auto'}>
        <div className={'my-2 flex flex-col justify-center overflow-y-auto'}>
          {eventRegistrations.length === 0 && <div className="m-2 text-center">{t('textNoRegistrations')}</div>}
          {eventRegistrations.length > 0 && <div className="m-2 text-center">{`${t('textAmountOfRegistrations')}: ${competitionParticipants.length}`}</div>}

          {eventRegistrations.map((registration, index) => {
            return (
              <div key={index} className="m-1 flex items-center">
                <div className="mx-1 flex w-1/2 justify-end">
                  <UserCard user={registration.user} />
                </div>
                <div className="mx-1 flex w-1/2 justify-start">
                  <div className="flex">
                    {competitionParticipants.some(e => e.username === registration.user.username) && (
                      <>
                        <div className="flex h-full w-20 items-center justify-center">{t('btnAssigned')}</div>
                        <div className="ml-1">
                          <ActionButton
                            action={Action.DELETE}
                            onClick={() => {
                              // @ts-ignore
                              handleRemoveParticipantClicked(competition.id, registration.user.username);
                            }}
                          />
                        </div>
                      </>
                    )}
                    {!competitionParticipants.some(e => e.username === registration.user.username) && (
                      <>
                        <div className="flex h-full w-20 items-center justify-center">{t('btnUnassigned')}</div>
                        <div className="mx-1">
                          <ActionButton
                            action={Action.ADD}
                            onClick={() => {
                              // @ts-ignore
                              handleAddParticipantClicked(competition.id, registration.user.username);
                            }}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
