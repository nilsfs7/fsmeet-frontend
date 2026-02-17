'use client';

import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Event } from '@/domain/types/event';
import { toast, Toaster } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import { switchTab } from '@/functions/switch-tab';
import UserSection from '@/components/events/user-section';
import { routeEvents, routeLogin } from '@/domain/constants/routes';
import { EventRegistration } from '@/domain/types/event-registration';
import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/animation/loading-spinner';
import { getUser } from '@/infrastructure/clients/user.client';
import { EventRegistrationStatus } from '@/domain/enums/event-registration-status';
import { User } from '@/domain/types/user';
import { EventComment } from '@/domain/types/event-comment';
import { Sponsor } from '@/domain/types/sponsor';
import { validateSession } from '@/functions/validate-session';
import { createComment, createSubComment, deleteComment, deleteSubComment, getEventRegistrations } from '@/infrastructure/clients/event.client';
import { Session } from 'next-auth';
import { SponsorSection } from './sponsor-section';
import { EventInfo } from './event-info';
import { CommentSection } from './comment-section';
import { CompetitionSection } from './competition-section';
import { isEventAdmin } from '@/functions/is-event-admin';
import { EventRegistrationType } from '@/domain/types/event-registration-type';
import { Competition } from '@/domain/types/competition';
import { AttachmentSection } from './attachment-section';
import { Attachment } from '@/domain/types/attachment';
import moment from 'moment';
import { isInEventRegistrations } from '../../../../functions/is-in-event-registrations';

interface ITabsMenu {
  event: Event;
  competitions: Competition[];
  attachments: Attachment[];
  sponsors: Sponsor[];
  comments: EventComment[];
}

export const TabsMenu = ({ event, competitions, sponsors, attachments, comments }: ITabsMenu) => {
  const t = useTranslations('/events/eventid');
  const { data: session } = useSession();

  const router = useRouter();

  const searchParams = useSearchParams();
  const tab = searchParams?.get('tab');

  const [eventAdmin, setEventAdmin] = useState<User>();
  const [eventRegistrations, setEventRegistrations] = useState<EventRegistration[]>([]);
  const [participantRegistrations, setParticipantRegistrations] = useState<EventRegistration[]>([]);
  const [visitorRegistrations, setVisitorRegistrations] = useState<EventRegistration[]>([]);

  const [loginRouteWithCallbackUrl, setLoginRouteWithCallbackUrl] = useState<string>('');

  const handlePostCommentClicked = async (message: string) => {
    if (!validateSession(session)) {
      router.push(loginRouteWithCallbackUrl);
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
      router.push(loginRouteWithCallbackUrl);
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

  const handleDeleteCommentClicked = async (commentId: string, isSubComment: boolean) => {
    if (!validateSession(session)) {
      router.push(loginRouteWithCallbackUrl);
      return;
    }

    if (event.id) {
      try {
        if (isSubComment) {
          await deleteSubComment(event.id, commentId, session);
        } else {
          await deleteComment(event.id, commentId, session);
        }

        router.refresh();
      } catch (error: any) {
        toast.error(error.message);
        console.error(error.message);
      }
    }
  };

  useEffect(() => {
    if (event.id)
      getEventRegistrations(event.id, null, session).then(registrations => {
        setEventRegistrations(registrations);
      });
  }, []);

  useEffect(() => {
    async function loadEventInfos() {
      const approvedWithImage = eventRegistrations
        .filter((registration: EventRegistration) => registration.status == EventRegistrationStatus.APPROVED && registration.user.imageUrl)
        .sort((a, b) => (a.user.username > b.user.username ? 1 : -1));
      const approvedNoImage = eventRegistrations
        .filter((registration: EventRegistration) => registration.status == EventRegistrationStatus.APPROVED && !registration.user.imageUrl)
        .sort((a, b) => (a.user.username > b.user.username ? 1 : -1));
      const pendingWithImage = eventRegistrations
        .filter((registration: EventRegistration) => registration.status == EventRegistrationStatus.PENDING && registration.user.imageUrl)
        .sort((a, b) => (a.user.username > b.user.username ? 1 : -1));
      const pendingNoImage = eventRegistrations
        .filter((registration: EventRegistration) => registration.status == EventRegistrationStatus.PENDING && !registration.user.imageUrl)
        .sort((a, b) => (a.user.username > b.user.username ? 1 : -1));

      setParticipantRegistrations(
        approvedWithImage
          .concat(approvedNoImage)
          .concat(pendingWithImage)
          .concat(pendingNoImage)
          .filter(visitor => {
            if (visitor.type === EventRegistrationType.PARTICIPANT) return visitor;
          }),
      );
      setVisitorRegistrations(
        approvedWithImage
          .concat(approvedNoImage)
          .concat(pendingWithImage)
          .concat(pendingNoImage)
          .filter(visitor => {
            if (visitor.type === EventRegistrationType.VISITOR) return visitor;
          }),
      );

      if (event.admin) {
        getUser(event.admin).then(user => {
          setEventAdmin(user);
        });
      }
    }

    loadEventInfos();
  }, [eventRegistrations]);

  useEffect(() => {
    setLoginRouteWithCallbackUrl(`${routeLogin}?callbackUrl=${window.location.origin}${routeEvents}%2F${event.id}`);
  }, []);

  if (!participantRegistrations || !visitorRegistrations) {
    return <LoadingSpinner />; // todo: notwendig?
  }

  return (
    <>
      <Toaster richColors />

      <Tabs defaultValue={tab || `overview`} className="flex flex-col h-full">
        <TabsList>
          <TabsTrigger
            value="overview"
            onClick={() => {
              switchTab(router, 'overview');
            }}
          >
            {t('tabOverviewTitle')}
          </TabsTrigger>
          {competitions.length > 0 && (
            <TabsTrigger
              value="competitions"
              onClick={() => {
                switchTab(router, 'competitions');
              }}
            >
              {t('tabCompetitionsTitle')}
            </TabsTrigger>
          )}
          {(participantRegistrations.length > 0 || visitorRegistrations.length > 0) && (
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
          {eventAdmin && <EventInfo event={event} eventAdmin={eventAdmin} showMessangerInvitationUrl={isEventAdmin(event, session) || isInEventRegistrations(eventRegistrations, session)} />}

          {sponsors?.length > 0 && (
            <div className="mt-2">
              <SponsorSection eventSponsors={sponsors} />
            </div>
          )}

          {attachments?.some(att => {
            if (att.enabled) {
              if (!att.expires || (att.expires && moment(att.expiryDate) > moment())) {
                return att;
              }
            }
          }) && (
            <div className="mt-2">
              <AttachmentSection eventAttachments={attachments} />
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
                onDeleteComment={(commentId: string, isSubComment: boolean) => {
                  handleDeleteCommentClicked(commentId, isSubComment);
                }}
              />
            </div>
          )}
        </TabsContent>

        {/* Competitions */}
        {event.id && competitions.length > 0 && (
          <TabsContent value="competitions" className="overflow-hidden overflow-y-auto">
            <CompetitionSection competitions={competitions} eventId={event.id} />
          </TabsContent>
        )}

        {/* Attendees */}
        {(participantRegistrations.length > 0 || visitorRegistrations.length > 0) && (
          <TabsContent value="registrations" className="overflow-hidden overflow-y-auto">
            <div className="flex flex-col gap-2">
              {participantRegistrations.length > 0 && (
                <UserSection
                  sectionTitle={t('tabRegistrationsSectionRegistrationParticipants')}
                  users={participantRegistrations.map(registration => {
                    return registration.user;
                  })}
                  showUserCountryFlag={event.showUserCountryFlag}
                  registrationStatus={participantRegistrations.map(registration => {
                    return registration.status;
                  })}
                />
              )}

              {visitorRegistrations.length > 0 && (
                <UserSection
                  sectionTitle={t('tabRegistrationsSectionRegistrationVisitors')}
                  users={visitorRegistrations.map(registration => {
                    return registration.user;
                  })}
                  showUserCountryFlag={event.showUserCountryFlag}
                  registrationStatus={visitorRegistrations.map(registration => {
                    return registration.status;
                  })}
                />
              )}
            </div>
          </TabsContent>
        )}
      </Tabs>
    </>
  );
};
