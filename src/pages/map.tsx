import { Header } from '@/components/Header';
import MapOfFreestylers from '@/components/MapOfFreestylers';
import Navigation from '@/components/Navigation';
import ActionButton from '@/components/common/ActionButton';
import ComboBox from '@/components/common/ComboBox';
import TextButton from '@/components/common/TextButton';
import { Input } from '@/components/ui/input';
import { getUser } from '@/services/fsmeet-backend/get-user';
import { getUsers } from '@/services/fsmeet-backend/get-users';
import { menuGenderWithBoth } from '@/types/consts/menus/menu-gender';
import { routeAccount, routeHome } from '@/types/consts/routes';
import { Action } from '@/types/enums/action';
import { Gender } from '@/types/enums/gender';
import { User } from '@/types/user';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

const FreestylersMap = ({ data, actingUser }: { data: any; actingUser: any }) => {
  const users: User[] = data;
  const user: User = actingUser;

  const searchParams = useSearchParams();
  const paramUser = searchParams.get('user');
  const paramLat = searchParams.get('lat');
  const paramLng = searchParams.get('lng');

  const [filterName, setFilterName] = useState('');
  const [filterGender, setGender] = useState<Gender>();

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
    <div className="absolute inset-0 flex flex-col">
      <Header />

      <div className={'flex flex-col items-center'}>
        <h1 className="mt-2 text-xl">{`Freestyler Map`}</h1>
      </div>

      <div className="mt-2 mx-2 flex gap-2">
        <Input
          placeholder="Search name..."
          value={filterName}
          onChange={(event: any) => {
            setFilterName(event.target.value);
          }}
          className="max-w-40"
        />

        <ComboBox
          menus={menuGenderWithBoth}
          value={filterGender ? filterGender : menuGenderWithBoth[0].value}
          onChange={(value: any) => {
            setGender(value);
          }}
        />
      </div>

      <div className="mt-2 h-full max-h-screen overflow-hidden">
        {paramLat && paramLng && (
          <MapOfFreestylers lat={+paramLat} lng={+paramLng} zoom={7} users={users} selectedUsers={[paramUser ? paramUser : '']} filterName={filterName} filterGender={filterGender} />
        )}
        {(!paramLat || !paramLng) && <MapOfFreestylers zoom={4} users={users} filterName={filterName} filterGender={filterGender} />}
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
              <Link href={`${routeAccount}?tab=map`}>
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
