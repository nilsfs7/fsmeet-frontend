'use client';

import { useEffect, useState } from 'react';
import { Action } from '@/domain/enums/action';
import Link from 'next/link';
import { routeUsers } from '@/domain/constants/routes';
import ActionButton from '@/components/common/action-button';
import ComboBox from '@/components/common/combo-box';
import LoadingSpinner from '@/components/animation/loading-spinner';
import { Toaster, toast } from 'sonner';
import { User } from '@/domain/types/user';
import { menuUserVerificationStates } from '@/domain/constants/menus/menu-user-verification-states';
import { UserVerificationState } from '@/domain/enums/user-verification-state';
import { getUsers, updateUserVerificationState } from '@/infrastructure/clients/user.client';
import { useSession } from 'next-auth/react';
import Separator from '../../../../components/seperator';

interface IUserListProps {
  users: User[];
}

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
    return <LoadingSpinner />;
  }

  const UserList = ({ users }: IUserListProps) => {
    return (
      <>
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
      </>
    );
  };

  return (
    <>
      <Toaster richColors />

      <div className="mx-2 overflow-y-auto">
        <div className={'rounded-lg border border-primary bg-secondary-light p-2 text-sm'}>
          <div className="flex flex-col">
            <UserList users={users.filter(u => u.verificationState === UserVerificationState.VERIFICATION_PENDING)} />

            {users.some(u => u.verificationState === UserVerificationState.DENIED) && (
              <>
                <Separator />
                <UserList users={users.filter(u => u.verificationState === UserVerificationState.DENIED)} />
              </>
            )}

            {users.some(u => u.verificationState === UserVerificationState.NOT_VERIFIED) && (
              <>
                <Separator />
                <UserList users={users.filter(u => u.verificationState === UserVerificationState.NOT_VERIFIED)} />
              </>
            )}

            {users.some(u => u.verificationState === UserVerificationState.VERIFIED) && (
              <>
                <Separator />
                <UserList users={users.filter(u => u.verificationState === UserVerificationState.VERIFIED)} />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
