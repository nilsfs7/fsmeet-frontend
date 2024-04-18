import { useEffect, useState } from 'react';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { Action } from '@/types/enums/action';
import Link from 'next/link';
import { routeAdminOverview, routeLogin, routeUsers } from '@/types/consts/routes';
import { validateSession } from '@/types/funcs/validate-session';
import ActionButton from '@/components/common/ActionButton';
import Navigation from '@/components/Navigation';
import ComboBox from '@/components/common/ComboBox';
import LoadingSpinner from '@/components/animation/loading-spinner';
import { Toaster, toast } from 'sonner';
import { getUsers } from '@/services/fsmeet-backend/get-users';
import { User } from '@/types/user';
import { menuUserVerificationStates } from '@/types/consts/menus/menu-user-verification-states';
import { UserVerificationState } from '@/types/enums/user-verification-state';
import { updateUserVerificationState } from '@/services/fsmeet-backend/update-user-verification-state';

const Users = (props: any) => {
  const session = props.session;

  const [users, setUsers] = useState<User[]>([]);

  const handlUserVerificationStateChanged = async (username: string, verificationState: UserVerificationState) => {
    let usrs = Array.from(users);
    usrs = usrs.map((usr) => {
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
      console.error(error);
      toast.error(error);
    }
  };

  useEffect(() => {
    getUsers().then((users) => {
      setUsers(users);
    });
  }, [users == undefined]);

  if (!users) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Toaster richColors />

      <div className="absolute inset-0 flex flex-col overflow-hidden">
        <div className="m-2 text-center text-base font-bold">{`Manage Users`}</div>

        <div className="m-2 overflow-y-auto">
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

        <Navigation>
          <Link href={routeAdminOverview}>
            <ActionButton action={Action.BACK} />
          </Link>
        </Navigation>
      </div>
    </>
  );
};

export default Users;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await getSession(context);

  if (!validateSession(session)) {
    return {
      redirect: {
        permanent: false,
        destination: routeLogin,
      },
    };
  }

  return {
    props: {
      session: session,
    },
  };
};
