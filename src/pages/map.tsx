import { Header } from '@/components/Header';
import MapOfFreestylers from '@/components/MapOfFreestylers';
import Navigation from '@/components/Navigation';
import PageTitle from '@/components/PageTitle';
import ActionButton from '@/components/common/ActionButton';
import TextButton from '@/components/common/TextButton';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { getUser } from '@/services/fsmeet-backend/get-user';
import { getUsers } from '@/services/fsmeet-backend/get-users';
import { menuGender } from '@/types/consts/menus/menu-gender';
import { routeAccount, routeHome } from '@/types/consts/routes';
import { Action } from '@/types/enums/action';
import { Gender } from '@/types/enums/gender';
import { copyToClipboard } from '@/types/funcs/copy-to-clipboard';
import { User } from '@/types/user';
import { ChevronDown } from 'lucide-react';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Toaster, toast } from 'sonner';

const FreestylerMap = ({ data, actingUser }: { data: any; actingUser: any }) => {
  const users: User[] = data;
  const user: User = actingUser;

  const searchParams = useSearchParams();
  const paramUser = searchParams?.get('user');
  const paramLat = searchParams?.get('lat');
  const paramLng = searchParams?.get('lng');

  const [filterName, setFilterName] = useState('');
  const [filterGender, setFilterGender] = useState<Gender[]>([Gender.FEMALE, Gender.MALE]);

  const handleShareClicked = async () => {
    copyToClipboard(window.location.toString());
    toast.info('Map URL copied to clipboard.');
  };

  return (
    <>
      <Toaster richColors />

      <div className="h-[calc(100dvh)] flex flex-col">
        <Header />

        <PageTitle title="Freestyler Map" />

        <div className="mx-2 flex gap-2">
          <Input
            placeholder="Search name..."
            value={filterName}
            onChange={(event: any) => {
              setFilterName(event.target.value);
            }}
            className="max-w-40"
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Gender <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {menuGender.map((menuItem) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={menuItem.value}
                    checked={filterGender.includes(menuItem.value as Gender)}
                    onCheckedChange={(value: any) => {
                      const genders = Array.from(filterGender);

                      // add or remove gender from array
                      if (value === true) {
                        genders.push(menuItem.value as Gender);
                      } else {
                        const index = genders.indexOf(menuItem.value as Gender);
                        if (index > -1) {
                          genders.splice(index, 1);
                        }
                      }

                      setFilterGender(genders);
                    }}
                  >
                    {menuItem.text}
                  </DropdownMenuCheckboxItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
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
    </>
  );
};

export default FreestylerMap;

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
