'use client';

import { useEffect, useState } from 'react';
import { Action } from '@/domain/enums/action';
import Link from 'next/link';
import { routeUsers } from '@/domain/constants/routes';
import ActionButton from '@/components/common/ActionButton';
import LoadingSpinner from '@/components/animation/loading-spinner';
import { Toaster, toast } from 'sonner';
import { User } from '@/domain/types/user';
import { getUsers, updateUserWffaId } from '@/infrastructure/clients/user.client';
import { useSession } from 'next-auth/react';
import { Input } from '@/components/ui/input';
import Separator from '@/components/Seperator';
import { UserType } from '@/domain/enums/user-type';

export const WffaIdEditor = () => {
  const { data: session, status } = useSession();

  const [usersMap, setUsersMap] = useState<{ user: User; newWffaId: string }[]>([]);

  const handleWffaIdChanged = async (username: string, wffaId: string) => {
    let map = Array.from(usersMap);

    map = map.map(item => {
      if (item.user.username === username) {
        item.newWffaId = wffaId.toUpperCase();
      }

      return item;
    });

    setUsersMap(map);
  };

  const handleSaveUserClicked = async (user: User) => {
    const item = usersMap.filter(item => {
      if (item.user.username === user.username) return true;
    })[0];

    try {
      await updateUserWffaId(session, user.username, item.newWffaId);
      toast.success(`Freestyler ID for ${user.username} (${user.firstName}) updated.`);
    } catch (error: any) {
      toast.error(error.message);
      console.error(error.message);
    }
  };

  useEffect(() => {
    getUsers(UserType.FREESTYLER).then(users => {
      setUsersMap(
        users.map(user => {
          return { user, newWffaId: user.wffaId || '' };
        })
      );
    });
  }, [usersMap === undefined]);

  if (!usersMap) {
    return <LoadingSpinner text="Loading..." />; // todo
  }

  return (
    <>
      <Toaster richColors />

      <div className="mx-2 overflow-y-auto">
        <div className={'rounded-lg border border-primary bg-secondary-light p-2 text-sm'}>
          <div className="flex flex-col">
            {usersMap.map((item, index) => {
              if (!item.user.wffaId)
                return (
                  <div key={index} className="m-1 flex items-center">
                    <div className="mx-1 flex w-1/2 justify-end gap-1">
                      <Link className="float-right" href={`${routeUsers}/${item.user.username}`}>
                        {item.user.username}
                      </Link>

                      <Link className="float-right" href={`${routeUsers}/${item.user.username}`}>
                        {`(${item.user.firstName})`}
                      </Link>
                    </div>
                    <div className="mx-1 flex w-1/2 justify-start">
                      <>
                        <Input
                          className="w-20"
                          value={item.newWffaId}
                          onChange={e => {
                            handleWffaIdChanged(item.user.username, e.currentTarget.value);
                          }}
                        />

                        {item.user.wffaId !== item.newWffaId && (
                          <div className="ml-1">
                            <ActionButton
                              action={Action.SAVE}
                              onClick={() => {
                                handleSaveUserClicked(item.user);
                              }}
                            />
                          </div>
                        )}
                      </>
                    </div>
                  </div>
                );
            })}

            <div className="my-2">
              <Separator />
            </div>

            {usersMap.map((item, index) => {
              if (item.user.wffaId)
                return (
                  <div key={index} className="m-1 flex items-center">
                    <div className="mx-1 flex w-1/2 justify-end gap-1">
                      <Link className="float-right" href={`${routeUsers}/${item.user.username}`}>
                        {item.user.username}
                      </Link>

                      <Link className="float-right" href={`${routeUsers}/${item.user.username}`}>
                        {`(${item.user.firstName})`}
                      </Link>
                    </div>
                    <div className="mx-1 flex w-1/2 justify-start">
                      <>
                        <Input
                          className="w-20"
                          value={item.newWffaId}
                          onChange={e => {
                            handleWffaIdChanged(item.user.username, e.currentTarget.value);
                          }}
                        />

                        {item.user.wffaId !== item.newWffaId && (
                          <div className="ml-1">
                            <ActionButton
                              action={Action.SAVE}
                              onClick={() => {
                                handleSaveUserClicked(item.user);
                              }}
                            />
                          </div>
                        )}
                      </>
                    </div>
                  </div>
                );
            })}
          </div>
        </div>
      </div>
    </>
  );
};
