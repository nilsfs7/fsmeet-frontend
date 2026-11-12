'use client';

import { useEffect, useState, type ReactNode } from 'react';
import LoadingSpinner from '@/components/animation/loading-spinner';
import { User } from '@/domain/types/user';
import { getUsers } from '@/infrastructure/clients/user.client';
import { getEventCount, getMobileUserCount, getUserCountByNationality, getUserCountByType, getUserCountOnMap, getUserGrowth } from '@/infrastructure/clients/statistic.client';
import { ReadUserCountResponseDto } from '@/infrastructure/clients/dtos/statistics/read-user-count.response.dto';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { ChartArea } from '../../../components/charts/chart-area';
import { ReadEventCountResponseDto } from '../../../infrastructure/clients/dtos/event/read-event-count.response.dto';
import { ReadUserGrowthResponseDto } from '../../../infrastructure/clients/dtos/event/read-user-growth.response.dto';
import { useTranslations } from 'next-intl';

function StatCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="min-w-0 rounded-2xl border border-border bg-background p-5 shadow-xs">
      <h2 className="mb-3 text-base font-semibold text-foreground">{title}</h2>
      {children}
    </section>
  );
}

function StatRows({ rows }: { rows: [string, number | undefined][] }) {
  return (
    <dl className="divide-y divide-border/60">
      {rows.map(([label, value]) => (
        <div key={label} className="flex items-center justify-between gap-3 py-1.5">
          <dt className="text-muted-foreground">{label.replace(/:\s*$/, '')}</dt>
          <dd className="font-semibold tabular-nums text-foreground">{value ?? '–'}</dd>
        </div>
      ))}
    </dl>
  );
}

export const Statistics = () => {
  const t = useTranslations('/stats');
  const [userCountByType, setUserCountByType] = useState<ReadUserCountResponseDto>();
  const [userNationalityCount, setUserNationalityCount] = useState<{ countryCode: string; userCount: number }[]>([]);
  const [userCountOnMap, setUserCountOnMap] = useState<number>(0);
  const [mobileUserCount, setMobileUserCount] = useState<number>(0);
  const [userGrowth, setUserGrowth] = useState<ReadUserGrowthResponseDto[]>([]);
  const [eventCount, setEventCount] = useState<ReadEventCountResponseDto[]>([]);
  const [hexColors, setHexColors] = useState<string[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const generateRandomHexColors = (count: number) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const color =
        '#' +
        Math.floor(Math.random() * 0xffffff)
          .toString(16)
          .padStart(6, '0');
      colors.push(color);
    }
    return colors;
  };

  const renderLabel = ({ name, percent }: { name: string; percent: number }) => {
    if (!name) {
      name = 'unknown';
    }

    return `${name}: ${(percent * 100).toFixed(0)}%`;
  };

  useEffect(() => {
    getUserCountByType().then(dto => {
      setUserCountByType(dto);
    });

    getUserCountByNationality().then(dtos => {
      const thresholdMinimumShareInPercent = 1.8;
      const totalCount = dtos.reduce((sum, item) => sum + item.userCount, 0);
      const consolidatedNatCount: { countryCode: string; userCount: number }[] = [];
      const minorityNatCount: { countryCode: string; userCount: number } = { countryCode: 'other', userCount: 0 };

      dtos.map(item => {
        if ((item.userCount / totalCount) * 100 > thresholdMinimumShareInPercent) {
          consolidatedNatCount.push({ countryCode: item.countryCode, userCount: item.userCount });
        } else {
          minorityNatCount.userCount += item.userCount;
        }
      });
      consolidatedNatCount.push(minorityNatCount);

      setUserNationalityCount(consolidatedNatCount);
      setHexColors(generateRandomHexColors(consolidatedNatCount.length));
    });

    getUserCountOnMap().then(dto => {
      setUserCountOnMap(dto.userCountOnMap);
    });

    getMobileUserCount().then(dto => {
      setMobileUserCount(dto.mobileUserCount);
    });

    getUserGrowth().then(dto => {
      setUserGrowth(dto);
    });

    getEventCount().then(dto => {
      setEventCount(dto);
    });

    getUsers().then(users => {
      setUsers(users);
    });
  }, [users == undefined, userCountByType == undefined]);

  if (!users) {
    return <LoadingSpinner />;
  }

  const total = userCountByType?.userCountTotal ?? 0;
  const mapShare = total ? (userCountOnMap / total) * 100 : 0;
  const typeRows: [string, number | undefined][] = [
    [t('freestylers'), userCountByType?.userCountFreestylers],
    [t('associations'), userCountByType?.userCountAssociations],
    [t('brands'), userCountByType?.userCountBrands],
    [t('djs'), userCountByType?.userCountDJs],
    [t('organizers'), userCountByType?.userCountEventOrganizers],
    [t('mcs'), userCountByType?.userCountMCs],
    [t('media'), userCountByType?.userCountMedia],
    [t('fans'), userCountByType?.userCountFans],
  ];
  const totalRows: [string, number | undefined][] = [
    [t('totalUsers'), userCountByType?.userCountTotal],
    [t('realUsers'), userCountByType?.userCountNonAdministrative],
    [t('adminUsers'), userCountByType?.userCountAdministrative],
    [t('mobileUsers'), mobileUserCount],
  ];

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6 sm:px-6 md:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 text-sm">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <StatCard title={t('userCount')}>
            <StatRows rows={typeRows} />
          </StatCard>

          <StatCard title={t('totalUserCount')}>
            <StatRows rows={totalRows} />
            <p className="mt-3 text-xs text-muted-foreground">{t('mobileHint')}</p>
          </StatCard>

          {total > 0 && (
            <StatCard title={t('mapShare')}>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold tabular-nums text-foreground">{mapShare.toFixed(1)}%</span>
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-brand" style={{ width: `${Math.min(100, mapShare)}%` }} />
              </div>
              <div className="mt-4">
                <StatRows
                  rows={[
                    [t('usersOnMap'), userCountOnMap],
                    [t('totalUsers'), total],
                  ]}
                />
              </div>
            </StatCard>
          )}
        </div>

        <StatCard title={t('nationalityShare')}>
          <div className="flex justify-center overflow-hidden">
            <PieChart width={360} height={340}>
              <Pie data={userNationalityCount} dataKey="userCount" nameKey="countryCode" cx="50%" cy="50%" outerRadius={100} fill="#ccd6dd" label={renderLabel}>
                {userNationalityCount.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={hexColors[index % hexColors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
        </StatCard>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <ChartArea
            data={userGrowth.map(ds => {
              return { date: ds.date.toString(), l1: ds.total, l2: ds.malesCount, l3: ds.femalesCount };
            })}
            labels={[t('labelTotal'), t('labelMale'), t('labelFemale')]}
            colors={['--chart-1', '--chart-2', '--chart-5']}
            title={t('growthTitle')}
            description={t('growthDesc')}
          />

          <ChartArea
            data={userGrowth.map(ds => {
              return { date: ds.date.toString(), l1: ds.maleFreestylersCount + ds.femaleFreestylersCount, l2: ds.maleFreestylersCount, l3: ds.femaleFreestylersCount };
            })}
            labels={[t('labelTotal'), t('labelMaleFreestylers'), t('labelFemaleFreestylers')]}
            colors={['--chart-1', '--chart-2', '--chart-5']}
            title={t('growthFreestylerTitle')}
            description={t('growthFreestylerDesc')}
          />

          {/* todo: all in one attempts */}
          {/* <ChartArea
            data={eventCount.map(ds => {
              return { date: ds.date.toString(), l1: ds.total, l2: ds.compsCount, l3: ds.onlineCompsCount, l4: ds.meetingsCount };
            })}
            labels={['Total', 'Comps', 'Online Comps', 'Meetings']}
            colors={['--chart-1', '--chart-5', '--chart-2', '--chart-4']}
            title={'Events created'}
            description={'Cumulative event count'}
          /> */}

          <ChartArea
            data={eventCount.map(ds => {
              return { date: ds.date.toString(), l1: ds.total };
            })}
            labels={[t('labelTotal')]}
            title={t('eventsCreated')}
            description={t('eventsCreatedDesc')}
          />

          <ChartArea
            data={eventCount.map(ds => {
              return { date: ds.date.toString(), l1: ds.compsCount };
            })}
            labels={[t('labelCompetitions')]}
            title={t('compsCreated')}
            description={t('compsCreatedDesc')}
          />

          <ChartArea
            data={eventCount.map(ds => {
              return { date: ds.date.toString(), l1: ds.onlineCompsCount };
            })}
            labels={[t('labelOnline')]}
            title={t('onlineCreated')}
            description={t('onlineCreatedDesc')}
          />

          <ChartArea
            data={eventCount.map(ds => {
              return { date: ds.date.toString(), l1: ds.meetingsCount };
            })}
            labels={[t('labelMeetings')]}
            title={t('meetingsCreated')}
            description={t('meetingsCreatedDesc')}
          />
        </div>
      </div>
    </div>
  );
};
