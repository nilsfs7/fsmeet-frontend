'use client';

import { useEffect, useState } from 'react';
import { Action } from '@/domain/enums/action';
import Link from 'next/link';
import { routeUsers } from '@/domain/constants/routes';
import ActionButton from '@/components/common/ActionButton';
import ComboBox from '@/components/common/ComboBox';
import LoadingSpinner from '@/components/animation/loading-spinner';
import { Toaster, toast } from 'sonner';
import { User } from '@/types/user';
import { menuUserVerificationStates } from '@/domain/constants/menus/menu-user-verification-states';
import { UserVerificationState } from '@/domain/enums/user-verification-state';
import { getUsers, updateUserVerificationState } from '@/infrastructure/clients/user.client';
import { useSession } from 'next-auth/react';

export const VerificationEditor = () => {
  const { data: session, status } = useSession();

  const [users, setUsers] = useState<User[]>([]);

  const handlUserVerificationStateChanged = async (username: string, verificationState: UserVerificationState) => {
    let usrs = Array.from(users);
    usrs = usrs.map(usr => {
      if (usr.username === username) {
        usr.verificationState = verificationState;
      }

      return usr;
    });
    setUsers(usrs);
  };

  const handleSaveUserClicked = async (user: User) => {
    try {
      if (user.verificationState) {
        await updateUserVerificationState(session, user.username, user.verificationState);
        toast.success(`Verification state for ${user.username} (${user.firstName}) updated.`);
      }
    } catch (error: any) {
      toast.error(error.message);
      console.error(error.message);
    }
  };

  useEffect(() => {
    getUsers().then(users => {
      setUsers(users);
    });
  }, [users == undefined]);

  if (!users) {
    return <LoadingSpinner text="Loading..." />; // todo
  }

  return (
    <>
      <Toaster richColors />

      <div className="mx-2 overflow-y-auto">
        <div className={'rounded-lg border border-primary bg-secondary-light p-2 text-sm'}>
          <div className="flex flex-col">
            {users.map((user, index) => {
              return (
                <div key={index} className="m-1 flex items-center">
                  <div className="mx-1 flex w-1/2 justify-end gap-1">
                    <Link className="float-right" href={`${routeUsers}/${user.username}`}>
                      {user.username}
                    </Link>

                    <Link className="float-right" href={`${routeUsers}/${user.username}`}>
                      {`(${user.firstName})`}
                    </Link>
                  </div>
                  <div className="mx-1 flex w-1/2 justify-start">
                    <>
                      <ComboBox
                        menus={menuUserVerificationStates}
                        value={user.verificationState || ''}
                        searchEnabled={false}
                        onChange={(value: any) => {
                          handlUserVerificationStateChanged(user.username, value);
                        }}
                      />

                      <div className="ml-1">
                        <ActionButton
                          action={Action.SAVE}
                          onClick={() => {
                            handleSaveUserClicked(user);
                          }}
                        />
                      </div>
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
