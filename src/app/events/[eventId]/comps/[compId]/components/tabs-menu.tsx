'use client';

import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSession } from 'next-auth/react';
import { User } from '@/domain/types/user';
import { useRouter, useSearchParams } from 'next/navigation';
import { getCompetitionParticipants, getRounds } from '@/infrastructure/clients/competition.client';
import { switchTab } from '@/functions/switch-tab';
import { useTranslations } from 'next-intl';
import { Competition } from '@/domain/types/competition';
import { Round } from '@/domain/classes/round';
import Separator from '@/components/Seperator';
import BattleList from '@/components/comp/BattleList';
import BattleGrid from '@/components/comp/BattleGrid';
import TextareaAutosize from 'react-textarea-autosize';
import { MaxAge } from '@/domain/enums/max-age';
import UserSection from '@/components/events/UserSection';
import { Switch } from '@/components/ui/switch';
import LoadingSpinner from '@/components/animation/loading-spinner';
import { UserType } from '@/domain/enums/user-type';
import ComboBox from '@/components/common/ComboBox';
import { MenuItem } from '@/domain/types/menu-item';
import { Event } from '@/domain/types/event';

interface ITabsMenu {
  comp: Competition;
  event: Event;
}

export const TabsMenu = ({ comp, event }: ITabsMenu) => {
  const t = useTranslations('/events/eventid/comps/compid');

  const { data: session } = useSession();

  const router = useRouter();

  const searchParams = useSearchParams();
  const tab = searchParams?.get('tab');

  const [participantsMenu, setParticipantsMenu] = useState<MenuItem[]>([]);
  const [rounds, setRounds] = useState<Round[]>();
  const [usersMap, setUsersMap] = useState<Map<string, User>>(new Map<string, User>());
  const [filteredByUser, setFilteredByUser] = useState<string>();
  const [showMyBattlesOnlyEnabled, setShowMyBattlesOnlyEnabled] = useState<boolean>(false);

  useEffect(() => {
    if (comp.id) {
      getRounds(comp.id).then(rounds => {
        if (rounds.length === 0) {
          setRounds([]);
        } else {
          setRounds(rounds);
        }
      });

      getCompetitionParticipants(comp.id).then(participants => {
        const compParticipants: User[] = [];
        const participantsMenu: MenuItem[] = [{ text: t('tabScheduleComboBoxParticipantFilterItemUnselected'), value: '' }];

        participants.map(participant => {
          const user: User = {
            username: participant.username,
            type: UserType.FREESTYLER,
            firstName: participant.firstName,
            lastName: participant.lastName,
            imageUrl: participant.imageUrl,
          };
          compParticipants.push(user);

          const participantMenuItem: MenuItem = { text: user.lastName ? `${user.firstName} ${user.lastName}` : `${user.firstName}`, value: user.username };
          participantsMenu.push(participantMenuItem);

          return user;
        });
        setParticipantsMenu(participantsMenu);

        const usersMap = new Map();
        participants.map(participant => {
          usersMap.set(participant.username, participant);
        });
        setUsersMap(usersMap);
      });
    }
  }, []);

  if (!rounds) {
    return <LoadingSpinner text="Loading..." />; // todo
  }

  return (
    <div className="mx-2 overflow-hidden">
      {/* TODO: comp serverseitig laden und tabs so wählen ->    {tab || rounds.length > 0 ? `schedule`: `info`} */}
      <Tabs defaultValue={tab || `schedule`} className="flex flex-col h-full">
        <TabsList className="mb-2">
          {rounds.length > 0 && (
            <TabsTrigger
              value="schedule"
              onClick={() => {
                switchTab(router, 'schedule');
              }}
            >
              {t('tabScheduleTitle')}
            </TabsTrigger>
          )}

          {rounds.length > 1 && (
            <TabsTrigger
              value="grid"
              onClick={() => {
                switchTab(router, 'grid');
              }}
            >
              {t('tabBattlGridTitle')}
            </TabsTrigger>
          )}

          <TabsTrigger
            value="info"
            onClick={() => {
              switchTab(router, 'info');
            }}
          >
            {t('tabInfoTitle')}
          </TabsTrigger>

          {usersMap.size > 0 && (
            <TabsTrigger
              value="participants"
              onClick={() => {
                switchTab(router, 'participants');
              }}
            >
              {t('tabParticipantsTitle')}
            </TabsTrigger>
          )}
        </TabsList>

        {/* Schedule */}
        {rounds.length > 0 && (
          <TabsContent value="schedule" className="overflow-hidden overflow-y-auto">
            {rounds.length > 1 && (
              <div className="m-2 flex flex-col items-center justify-center gap-4">
                <ComboBox
                  menus={participantsMenu}
                  value={filteredByUser || ''}
                  label={t('tabScheduleComboBoxParticipantFilterLabel')}
                  searchEnabled={true}
                  onChange={(value: any) => {
                    setFilteredByUser(value);

                    if (value !== session?.user?.username) {
                      setShowMyBattlesOnlyEnabled(false);
                    }
                  }}
                />

                {session?.user?.username && usersMap.get(session.user.username) && rounds.length > 1 && (
                  <div className="mb-2 flex items-center gap-2">
                    {t('tabScheduleSwitchMyBattlesOnly')}
                    <Switch
                      checked={showMyBattlesOnlyEnabled}
                      onCheckedChange={checked => {
                        setShowMyBattlesOnlyEnabled(checked);
                        checked ? setFilteredByUser(session.user.username) : setFilteredByUser('');
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            <BattleList rounds={rounds} usersMap={usersMap} filteredByUser={filteredByUser} showUserCountryFlag={event.showUserCountryFlag} />
          </TabsContent>
        )}

        {/* Battle Grid */}
        {rounds.length > 1 && (
          <TabsContent value="grid" className="overflow-hidden overflow-y-auto">
            <div className="overflow-x-auto">
              <BattleGrid rounds={rounds} usersMap={usersMap} showUserCountryFlag={event.showUserCountryFlag} />
            </div>
          </TabsContent>
        )}

        {/* Info */}
        <TabsContent value="info" className="overflow-hidden overflow-y-auto">
          <div className={'rounded-lg border border-secondary-dark bg-secondary-light p-2 text-sm'}>
            <div className="text-base font-bold">{t('tabInfoSectionGeneral')}</div>

            <div className="grid grid-cols-2 m-2 gap-4 w-fit">
              <div>
                <div>{t('tabInfoMode')}</div>
                <div>{t('tabInfoGender')}</div>
                <div>{t('tabInfoMaxAge')}</div>
              </div>
              <div className="capitalize">
                <div>{comp?.type}</div>
                <div>{comp?.gender}</div>
                <div>{comp?.maxAge !== MaxAge.NONE ? comp?.maxAge : `none`}</div>
              </div>
            </div>

            {comp?.description && (
              <>
                <Separator />
                <div className="mt-2">
                  <div className="text-base font-bold">{t('tabInfoSectionDescription')}</div>

                  <div className="m-2">
                    <TextareaAutosize readOnly className="w-full resize-none bg-transparent outline-none" value={comp.description} />
                  </div>
                </div>
              </>
            )}
          </div>

          {comp?.judges && comp?.judges.length > 0 && (
            <div className="mt-2">
              <UserSection sectionTitle={t('tabInfoSectionJudges')} showUserCountryFlag={event.showUserCountryFlag} users={comp.judges} />
            </div>
          )}

          {comp?.rules && (
            <div className={'mt-2 rounded-lg border border-secondary-dark bg-secondary-light p-2 text-sm'}>
              <div className="text-base font-bold">{t('tabInfoSectionRules')}</div>

              <div className="m-2">
                <TextareaAutosize readOnly className="w-full resize-none bg-transparent outline-none" value={comp.rules} />
              </div>
            </div>
          )}
        </TabsContent>

        {/* Participants */}
        {usersMap.size > 0 && (
          <TabsContent value="participants" className="overflow-hidden overflow-y-auto">
            <UserSection sectionTitle={t('tabParticipantsSectionParticipants')} showUserCountryFlag={event.showUserCountryFlag} users={Array.from(usersMap.values())} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};
