'use client';

import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Event } from '@/types/event';
import { Toaster } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import { switchTab } from '@/functions/switch-tab';
import UserSection from '@/components/events/UserSection';
import { routeLogin } from '@/domain/constants/routes';
import { EventRegistration } from '@/types/event-registration';
import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/animation/loading-spinner';
import { getUser } from '@/infrastructure/clients/user.client';
import { EventRegistrationStatus } from '@/domain/enums/event-registration-status';
import { User } from '@/types/user';
import { EventComment } from '@/types/event-comment';
import { Sponsor } from '@/types/sponsor';
import { validateSession } from '@/functions/validate-session';
import { createComment, createSubComment } from '@/infrastructure/clients/event.client';
import { Session } from 'next-auth';
import { SponsorSection } from './sponsor-section';
import { EventInfo } from './event-info';
import { CommentSection } from './comment-section';
import { CompetitionSection } from './competition-section';

interface ITabsMenu {
  event: Event;
  sponsors: Sponsor[];
  comments: EventComment[];
}

// todo: must be global
export const isRegistered = (event: Event, session: Session | null) => {
  if (validateSession(session)) {
    if (event && event.eventRegistrations.some((registration) => registration.user.username === session?.user?.username)) {
      return true;
    }
  }

  return false;
};

export const TabsMenu = ({ event, sponsors, comments }: ITabsMenu) => {
  const t = useTranslations('/events/eventid');
  const { data: session } = useSession();

  const router = useRouter();

  const searchParams = useSearchParams();
  const tab = searchParams?.get('tab');

  const [eventAdmin, setEventAdmin] = useState<User>();
  const [approvedAndPendingRegistrations, setApprovedAndPendingRegistrations] = useState<EventRegistration[]>();

  const isEventAdmin = () => {
    if (validateSession(session)) {
      if (event && event.admin === session?.user?.username) {
        return true;
      }
    }

    return false;
  };

  const handlePostCommentClicked = async (message: string) => {
    if (!validateSession(session)) {
      router.push(routeLogin);
      return;
    }

    if (event.id) {
      try {
        await createComment(event.id, message, session);
        router.refresh();
      } catch (error: any) {
        console.error(error.message);
      }
    }
  };

  const handlePostSubCommentClicked = async (commentId: string, message: string) => {
    if (!validateSession(session)) {
      router.push(routeLogin);
      return;
    }

    if (event.id) {
      try {
        await createSubComment(event.id, commentId, message, session);
        router.refresh();
      } catch (error: any) {
        console.error(error.message);
      }
    }
  };

  useEffect(() => {
    async function loadEventInfos() {
      const approvedWithImage = event.eventRegistrations
        .filter((registration: EventRegistration) => registration.status == EventRegistrationStatus.APPROVED && registration.user.imageUrl)
        .sort((a, b) => (a.user.username > b.user.username ? 1 : -1));
      const approvedNoImage = event.eventRegistrations
        .filter((registration: EventRegistration) => registration.status == EventRegistrationStatus.APPROVED && !registration.user.imageUrl)
        .sort((a, b) => (a.user.username > b.user.username ? 1 : -1));
      const pendingWithImage = event.eventRegistrations
        .filter((registration: EventRegistration) => registration.status == EventRegistrationStatus.PENDING && registration.user.imageUrl)
        .sort((a, b) => (a.user.username > b.user.username ? 1 : -1));
      const pendingNoImage = event.eventRegistrations
        .filter((registration: EventRegistration) => registration.status == EventRegistrationStatus.PENDING && !registration.user.imageUrl)
        .sort((a, b) => (a.user.username > b.user.username ? 1 : -1));

      setApprovedAndPendingRegistrations(approvedWithImage.concat(approvedNoImage).concat(pendingWithImage).concat(pendingNoImage));

      if (event.admin) {
        getUser(event.admin).then((user) => {
          setEventAdmin(user);
        });
      }
    }

    loadEventInfos();
  }, [event == undefined]);

  if (!approvedAndPendingRegistrations) {
    return <LoadingSpinner text="Loading..." />; // todo: notwendig?
  }

  return (
    <>
      <Toaster richColors />

      <Tabs defaultValue={tab || `overview`} className="flex flex-col h-full">
        <TabsList className="mb-2">
          <TabsTrigger
            value="overview"
            onClick={() => {
              switchTab(router, 'overview');
            }}
          >
            {t('tabOverviewTitle')}
          </TabsTrigger>
          {event.competitions.length > 0 && (
            <TabsTrigger
              value="competitions"
              onClick={() => {
                switchTab(router, 'competitions');
              }}
            >
              {t('tabCompetitionsTitle')}
            </TabsTrigger>
          )}
          {approvedAndPendingRegistrations.length > 0 && (
            <TabsTrigger
              value="registrations"
              onClick={() => {
                switchTab(router, 'registrations');
              }}
            >
              {t('tabRegistrationsTitle')}
            </TabsTrigger>
          )}
        </TabsList>

        {/* Details */}
        <TabsContent value="overview" className="overflow-hidden overflow-y-auto">
          {eventAdmin && <EventInfo event={event} eventAdmin={eventAdmin} showMessangerInvitationUrl={isEventAdmin() || isRegistered(event, session)} />}

          {sponsors?.length > 0 && (
            <div className="mt-2">
              <SponsorSection eventSponsors={sponsors} />
            </div>
          )}

          {event.allowComments && session?.user?.username && (
            <div className="mt-2">
              <CommentSection
                username={session.user.username}
                userProfileImageUrl={session?.user.imageUrl}
                eventComments={comments || []}
                onPostComment={(message: string) => {
                  handlePostCommentClicked(message);
                }}
                onPostReply={(commentId: string, message: string) => {
                  handlePostSubCommentClicked(commentId, message);
                }}
              />
            </div>
          )}
        </TabsContent>

        {/* Competitions */}
        {event.id && event.competitions.length > 0 && (
          <TabsContent value="competitions" className="overflow-hidden overflow-y-auto">
            <CompetitionSection competitions={event.competitions} eventId={event.id} />
          </TabsContent>
        )}

        {/* Registrations */}
        {approvedAndPendingRegistrations.length > 0 && (
          <TabsContent value="registrations" className="overflow-hidden overflow-y-auto">
            <UserSection
              sectionTitle={t('tabRegistrationsSectionRegistrations')}
              users={approvedAndPendingRegistrations.map((registration) => {
                return registration.user;
              })}
              registrationStatus={approvedAndPendingRegistrations.map((registration) => {
                return registration.status;
              })}
            />
          </TabsContent>
        )}
      </Tabs>
    </>
  );
};
