'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { IconCake, IconCalendarOff, IconGenderBigender, IconListNumbers, IconTournament, IconUsers } from '@tabler/icons-react';
import { EmptyState } from '@/components/common/empty-state';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSession } from 'next-auth/react';
import { User } from '@/domain/types/user';
import { useRouter, useSearchParams } from 'next/navigation';
import { getCompetitionParticipants, getRounds } from '@/infrastructure/clients/competition.client';
import { switchTab } from '@/functions/switch-tab';
import { useTranslations } from 'next-intl';
import { Competition } from '@/domain/types/competition';
import type { Round } from '@/domain/types/round';
import BattleList from '@/components/comp/battle-list';
import BattleGrid from '@/components/comp/battle-grid';
import { MaxAge } from '@/domain/enums/max-age';
import UserSection from '@/components/events/user-section';
import { ParticipantsPanel } from './participants-panel';
import { Switch } from '@/components/ui/switch';
import LoadingSpinner from '@/components/animation/loading-spinner';
import { UserType } from '@/domain/enums/user-type';
import ComboBox from '@/components/common/combo-box';
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
    return <LoadingSpinner />;
  }

  // Info is the default; an explicit ?tab= is honoured as long as that tab exists for this competition.
  // Schedule and bracket are always offered; without rounds they explain that no schedule exists yet.
  const availableTabs = ['schedule', 'grid', 'info', ...(usersMap.size > 0 ? ['participants'] : [])];
  const initialTab = tab && availableTabs.includes(tab) ? tab : 'info';

  const maxAgeText = comp?.maxAge !== MaxAge.NONE ? String(comp?.maxAge) : t('tabInfoNone');
  const infoTiles: [string, string, ReactNode][] = [
    [t('tabInfoMode'), comp?.type.replaceAll('_', ' ') ?? '', <IconTournament key="m" className="h-5 w-5" stroke={1.75} aria-hidden />],
    [t('tabInfoGender'), comp?.gender ?? '', <IconGenderBigender key="g" className="h-5 w-5" stroke={1.75} aria-hidden />],
    [t('tabInfoMaxAge'), maxAgeText, <IconCake key="a" className="h-5 w-5" stroke={1.75} aria-hidden />],
    [t('tabInfoParticipants'), String(usersMap.size), <IconUsers key="p" className="h-5 w-5" stroke={1.75} aria-hidden />],
    ...(rounds.length > 0 ? ([[t('tabInfoRounds'), String(rounds.length), <IconListNumbers key="r" className="h-5 w-5" stroke={1.75} aria-hidden />]] as [string, string, ReactNode][]) : []),
  ];

  const noSchedule = <EmptyState icon={<IconCalendarOff stroke={1.75} aria-hidden />} title={t('textNoScheduleTitle')} description={t('textNoScheduleDescription')} />;

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6 sm:px-6 md:px-8">
      <Tabs defaultValue={initialTab} className="mx-auto flex w-full max-w-content flex-col gap-4">
        <TabsList className="flex-nowrap justify-start self-start overflow-x-auto scrollbar-none max-w-full">
          <TabsTrigger
            value="schedule"
            onClick={() => {
              switchTab(router, 'schedule');
            }}
          >
            {t('tabScheduleTitle')}
          </TabsTrigger>

          <TabsTrigger
            value="grid"
            onClick={() => {
              switchTab(router, 'grid');
            }}
          >
            {t('tabBattlGridTitle')}
          </TabsTrigger>

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
              <span className="ml-1.5 rounded-full bg-muted px-1.5 text-2xs font-semibold text-muted-foreground">{usersMap.size}</span>
            </TabsTrigger>
          )}
        </TabsList>

        {/* Schedule */}
        <TabsContent value="schedule" className="mt-0 flex flex-col gap-4">
          {rounds.length === 0 && noSchedule}
          {rounds.length > 1 && (
            <div className="flex flex-col gap-3 rounded-2xl border border-border bg-background p-3 shadow-xs sm:flex-row sm:items-center sm:justify-between sm:p-4">
              <div className="flex min-w-0 flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">
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
              </div>

              {session?.user?.username && usersMap.get(session.user.username) && (
                <label className="flex shrink-0 cursor-pointer items-center justify-between gap-3 rounded-xl border border-border px-3 py-2 text-sm font-medium sm:justify-start">
                  {t('tabScheduleSwitchMyBattlesOnly')}
                  <Switch
                    checked={showMyBattlesOnlyEnabled}
                    onCheckedChange={checked => {
                      setShowMyBattlesOnlyEnabled(checked);
                      checked ? setFilteredByUser(session.user.username) : setFilteredByUser('');
                    }}
                  />
                </label>
              )}
            </div>
          )}

          {rounds.length > 0 && <BattleList rounds={rounds} usersMap={usersMap} filteredByUser={filteredByUser} showUserCountryFlag={event.showUserCountryFlag} />}
        </TabsContent>

        {/* Battle Grid */}
        <TabsContent value="grid" className="mt-0">
          {rounds.length === 0 ? (
            noSchedule
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-border bg-muted/30 p-3 sm:p-4">
              <BattleGrid rounds={rounds} usersMap={usersMap} showUserCountryFlag={event.showUserCountryFlag} />
            </div>
          )}
        </TabsContent>

        {/* Info */}
        <TabsContent value="info" className="mt-0 flex flex-col gap-4">
          <section className="rounded-2xl border border-border bg-background p-4 shadow-xs sm:p-5">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('tabInfoSectionGeneral')}</h2>
            <dl className={`grid grid-cols-2 gap-3 sm:grid-cols-3 ${infoTiles.length === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-5'}`}>
              {infoTiles.map(([label, value, icon]) => (
                <div key={label} className="flex min-w-0 items-center gap-3 rounded-xl bg-muted/40 p-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand-strong">{icon}</span>
                  <div className="min-w-0">
                    <dt className="truncate text-xs text-muted-foreground">{label}</dt>
                    <dd className="truncate text-sm font-semibold capitalize text-foreground">{value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </section>

          {comp?.description && (
            <section className="rounded-2xl border border-border bg-background p-4 shadow-xs sm:p-5">
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('tabInfoSectionDescription')}</h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">{comp.description}</p>
            </section>
          )}

          {comp?.judges && comp?.judges.length > 0 && <UserSection sectionTitle={t('tabInfoSectionJudges')} showUserCountryFlag={event.showUserCountryFlag} users={comp.judges} />}

          {comp?.rules && (
            <section className="rounded-2xl border border-border bg-background p-4 shadow-xs sm:p-5">
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('tabInfoSectionRules')}</h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">{comp.rules}</p>
            </section>
          )}
        </TabsContent>

        {/* Participants */}
        {usersMap.size > 0 && (
          <TabsContent value="participants" className="mt-0">
            <ParticipantsPanel title={t('tabParticipantsSectionParticipants')} showUserCountryFlag={Boolean(event.showUserCountryFlag)} users={Array.from(usersMap.values()) as User[]} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};
