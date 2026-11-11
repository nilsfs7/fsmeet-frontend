'use client';

import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/animation/loading-spinner';
import { User } from '@/domain/types/user';
import { getUsers } from '@/infrastructure/clients/user.client';
import { getEventCount, getMobileUserCount, getUserCountByNationality, getUserCountByType, getUserCountOnMap, getUserGrowth } from '@/infrastructure/clients/statistic.client';
import { ReadUserCountResponseDto } from '@/infrastructure/clients/dtos/statistics/read-user-count.response.dto';
import Separator from '@/components/separator';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { ChartArea } from '../../../components/charts/chart-area';
import { ReadEventCountResponseDto } from '../../../infrastructure/clients/dtos/event/read-event-count.response.dto';
import { ReadUserGrowthResponseDto } from '../../../infrastructure/clients/dtos/event/read-user-growth.response.dto';
import { useTranslations } from 'next-intl';

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

  return (
    <div className="mx-2 overflow-y-auto">
      <div className={'rounded-lg border border-primary bg-secondary-light p-2 text-sm'}>
        <div className="flex justify-center text-lg">{t('userCount')}</div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div className="flex justify-end">{t('freestylers')}</div>
          <div className="flex justify-start">{userCountByType?.userCountFreestylers}</div>

          <div className="flex justify-end">{t('associations')}</div>
          <div className="flex justify-start">{userCountByType?.userCountAssociations}</div>

          <div className="flex justify-end">{t('brands')}</div>
          <div className="flex justify-start">{userCountByType?.userCountBrands}</div>

          <div className="flex justify-end">{t('djs')}</div>
          <div className="flex justify-start">{userCountByType?.userCountDJs}</div>

          <div className="flex justify-end">{t('organizers')}</div>
          <div className="flex justify-start">{userCountByType?.userCountEventOrganizers}</div>

          <div className="flex justify-end">{t('mcs')}</div>
          <div className="flex justify-start">{userCountByType?.userCountMCs}</div>

          <div className="flex justify-end">{t('media')}</div>
          <div className="flex justify-start">{userCountByType?.userCountMedia}</div>

          <div className="flex justify-end">{t('fans')}</div>
          <div className="flex justify-start">{userCountByType?.userCountFans}</div>
        </div>
        <div className="m-2">
          <Separator />
        </div>
        <div className="flex justify-center text-lg">{t('totalUserCount')}</div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div className="flex justify-end">{t('totalUsers')}</div>
          <div className="flex justify-start">{userCountByType?.userCountTotal}</div>

          <div className="flex justify-end">{t('realUsers')}</div>
          <div className="flex justify-start">{userCountByType?.userCountNonAdministrative}</div>

          <div className="flex justify-end">{t('adminUsers')}</div>
          <div className="flex justify-start">{userCountByType?.userCountAdministrative}</div>

          <div className="flex justify-end">{t('mobileUsers')}</div>
          <div className="flex justify-start">{mobileUserCount}</div>
        </div>
        <div className="mt-2 text-center text-xs text-muted-foreground">{t('mobileHint')}</div>

        {userCountByType?.userCountTotal && (
          <>
            <div className="m-2">
              <Separator />
            </div>

            <div className="flex justify-center text-lg">{t('mapShare')}</div>

            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="flex justify-end">{t('usersOnMap')}</div>
              <div className="flex justify-start">{`${userCountOnMap} (${((userCountOnMap / userCountByType?.userCountTotal) * 100).toFixed(1)}%)`}</div>

              <div className="flex justify-end">{t('totalUsers')}</div>
              <div className="flex justify-start">{userCountByType?.userCountTotal}</div>
            </div>
          </>
        )}

        <div className="m-2">
          <Separator />
        </div>
        <div className="flex justify-center text-lg">{t('nationalityShare')}</div>
        <div className="flex justify-center">
          <PieChart width={400} height={400}>
            <Pie data={userNationalityCount} dataKey="userCount" nameKey="countryCode" cx="50%" cy="50%" outerRadius={100} fill="#ccd6dd" label={renderLabel}>
              {userNationalityCount.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={hexColors[index % hexColors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        <div className="m-2">
          <Separator />
        </div>

        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-2">
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
