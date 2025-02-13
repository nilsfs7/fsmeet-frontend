'use client';

import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/animation/loading-spinner';
import { User } from '@/types/user';
import { getUsers } from '@/infrastructure/clients/user.client';
import { getUserCount } from '@/infrastructure/clients/statistic.client';
import { ReadUserCountResponseDto } from '@/infrastructure/clients/dtos/statistics/read-user-count.response.dto';
import Separator from '@/components/Seperator';

export const UserStatistics = () => {
  const [userCount, setUserCount] = useState<ReadUserCountResponseDto>();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    getUserCount().then(dto => {
      setUserCount(dto);
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
        <div className="grid grid-cols-2 gap-2">
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

        <div className="grid grid-cols-2 gap-2">
          <div className="flex justify-end"> {`Total users:`}</div>
          <div className="flex justify-start">{userCount?.userCountTotal}</div>

          <div className="flex justify-end">{`Non-technical users:`}</div>
          <div className="flex justify-start">{userCount?.userCountNonTechnical}</div>

          <div className="flex justify-end">{`Technical users:`}</div>
          <div className="flex justify-start">{userCount?.userCountTechnical}</div>
        </div>
      </div>
    </div>
  );
};
