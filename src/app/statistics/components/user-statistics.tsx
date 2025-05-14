'use client';

import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/animation/loading-spinner';
import { User } from '@/types/user';
import { getUsers } from '@/infrastructure/clients/user.client';
import { getUserCount, getUserNationalityCount } from '@/infrastructure/clients/statistic.client';
import { ReadUserCountResponseDto } from '@/infrastructure/clients/dtos/statistics/read-user-count.response.dto';
import Separator from '@/components/Seperator';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

export const UserStatistics = () => {
  const [userCount, setUserCount] = useState<ReadUserCountResponseDto>();
  const [userNationalityCount, setUserNationalityCount] = useState<{ country: string; userCount: number }[]>([]);
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
    getUserCount().then(dto => {
      setUserCount(dto);
    });

    getUserNationalityCount().then(dtos => {
      const thresholdMinimumShareInPercent = 1.5;
      const totalCount = dtos.reduce((sum, item) => sum + item.userCount, 0);
      const consolidatedNatCount: { country: string; userCount: number }[] = [];
      const minorityNatCount: { country: string; userCount: number } = { country: 'other', userCount: 0 };

      dtos.map(item => {
        if ((item.userCount / totalCount) * 100 > thresholdMinimumShareInPercent) {
          consolidatedNatCount.push({ country: item.country, userCount: item.userCount });
        } else {
          minorityNatCount.userCount += item.userCount;
        }
      });
      consolidatedNatCount.push(minorityNatCount);

      setUserNationalityCount(consolidatedNatCount);
      setHexColors(generateRandomHexColors(consolidatedNatCount.length));
    });

    getUsers().then(users => {
      setUsers(users);
    });
  }, [users == undefined, userCount == undefined]);

  if (!users) {
    return <LoadingSpinner text="Loading..." />; // todo
  }

  return (
    <div className="mx-2 overflow-y-auto">
      <div className={'rounded-lg border border-primary bg-secondary-light p-2 text-sm'}>
        <div className="flex justify-center text-lg">{`User Count`}</div>

        <div className="grid grid-cols-2 gap-2 mt-2">
          <div className="flex justify-end">{`Freestylers:`}</div>
          <div className="flex justify-start">{userCount?.userCountFreestylers}</div>

          <div className="flex justify-end">{`Associations:`}</div>
          <div className="flex justify-start">{userCount?.userCountAssociations}</div>

          <div className="flex justify-end">{`Brands:`}</div>
          <div className="flex justify-start">{userCount?.userCountBrands}</div>

          <div className="flex justify-end">{`DJs:`}</div>
          <div className="flex justify-start">{userCount?.userCountDJs}</div>

          <div className="flex justify-end">{`Event organizers:`}</div>
          <div className="flex justify-start">{userCount?.userCountEventOrganizers}</div>

          <div className="flex justify-end">{`MCs:`}</div>
          <div className="flex justify-start">{userCount?.userCountMCs}</div>

          <div className="flex justify-end">{`Media:`}</div>
          <div className="flex justify-start">{userCount?.userCountMedia}</div>
        </div>

        <div className="m-2">
          <Separator />
        </div>

        <div className="flex justify-center text-lg">{`Total User Count`}</div>

        <div className="grid grid-cols-2 gap-2 mt-2">
          <div className="flex justify-end"> {`Total users:`}</div>
          <div className="flex justify-start">{userCount?.userCountTotal}</div>

          <div className="flex justify-end">{`Real users:`}</div>
          <div className="flex justify-start">{userCount?.userCountNonTechnical}</div>

          <div className="flex justify-end">{`Technical users:`}</div>
          <div className="flex justify-start">{userCount?.userCountTechnical}</div>
        </div>

        <div className="m-2">
          <Separator />
        </div>

        <div className="flex justify-center text-lg">{`User Share by Nationality`}</div>
        <div className="flex justify-center border-primary">
          <PieChart width={400} height={400}>
            <Pie data={userNationalityCount} dataKey="userCount" nameKey="country" cx="50%" cy="50%" outerRadius={100} fill="#ccd6dd" label={renderLabel}>
              {userNationalityCount.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={hexColors[index % hexColors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
      </div>
    </div>
  );
};
