import { LogoFSMeet } from '@/components/Logo';
import MapOfFreestylers from '@/components/MapOfFreestylers';
import Navigation from '@/components/Navigation';
import ActionButton from '@/components/common/ActionButton';
import TextButton from '@/components/common/TextButton';
import { getUser } from '@/services/fsmeet-backend/get-user';
import { getUsers } from '@/services/fsmeet-backend/get-users';
import { routeHome } from '@/types/consts/routes';
import { Action } from '@/types/enums/action';
import { User } from '@/types/user';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import Link from 'next/link';

const FreestylersMap = ({ data, actingUser }: { data: any; actingUser: any }) => {
  const users: User[] = data;
  const user: User = actingUser;

  const unsecuredCopyToClipboard = (text: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Unable to copy to clipboard', err);
    }
    document.body.removeChild(textArea);
  };

  const handleShareClicked = async () => {
    if (window.isSecureContext && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.toString());
    } else {
      unsecuredCopyToClipboard(window.location.toString());
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-secondary-light sm:block">
        <div className="mx-2 flex h-20 items-center justify-between">
          <LogoFSMeet />
        </div>
      </div>

      <div className="h-full">
        <MapOfFreestylers address={'Europe'} zoom={4} users={users} />
      </div>

      <Navigation>
        <Link href={routeHome}>
          <ActionButton action={Action.BACK} />
        </Link>

        <div className="flex justify-end">
          <div className="ml-1">
            <ActionButton action={Action.COPY} onClick={handleShareClicked} />
          </div>

          {(!user || (user && !user.locLatitude)) && (
            <div className="ml-1">
              <Link href={`/account`}>
                <TextButton text={'Add Your Pin'} />
              </Link>
            </div>
          )}
        </div>
      </Navigation>
    </div>
  );
};

export default FreestylersMap;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await getSession(context);

  let data: User[] = [];
  try {
    data = await getUsers();
  } catch (error: any) {
    console.error('Error fetching users.');
  }

  let actingUser = null;
  if (session?.user.username) {
    try {
      actingUser = await getUser(session?.user.username);
    } catch (error: any) {
      console.error(error);
    }
  }

  return {
    props: {
      data: data,
      actingUser: actingUser,
    },
  };
};
