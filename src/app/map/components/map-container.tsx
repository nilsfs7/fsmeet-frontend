'use client';

import MapOfFreestylers from '@/components/MapOfFreestylers';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { menuGender } from '@/domain/constants/menus/menu-gender';
import { Gender } from '@/domain/enums/gender';
import { User } from '@/types/user';
import { ChevronDown } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

export const MapContainer = ({ users }: { users: User[] }) => {
  const searchParams = useSearchParams();
  const paramUser = searchParams?.get('user');
  const paramLat = searchParams?.get('lat');
  const paramLng = searchParams?.get('lng');

  const [filterName, setFilterName] = useState('');
  const [filterGender, setFilterGender] = useState<Gender[]>([Gender.FEMALE, Gender.MALE]);

  return (
    <>
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
    </>
  );
};
