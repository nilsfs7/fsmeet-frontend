'use client';

import LoadingSpinner from '@/components/animation/loading-spinner';
import ActionButton from '@/components/common/ActionButton';
import { routeUsers } from '@/domain/constants/routes';
import { Action } from '@/domain/enums/action';
import { getLicenses, updateLicense } from '@/infrastructure/clients/license.client';
import { License } from '@/types/license';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner';

export const LicensesEditor = () => {
  const { data: session } = useSession();
  const [licenses, setLicenses] = useState<License[]>([]);

  const handleUpdateLicenseClicked = async (license: License, diff: number) => {
    const newAmount = license.amountEventLicenses + diff;
    if (newAmount >= 0 && newAmount < 100) {
      let lics = Array.from(licenses);
      lics = lics.map((lic) => {
        if (lic.username === license.username) {
          lic.amountEventLicenses = newAmount;
        }

        return lic;
      });
      setLicenses(lics);

      try {
        await updateLicense(session, license);
        toast.success(`Licenses for ${license.username} updated (${license.amountEventLicenses}).`);
      } catch (error: any) {
        toast.error(error.message);
        console.error(error.message);
      }
    }
  };

  useEffect(() => {
    if (session) {
      getLicenses(session).then((licenses) => {
        setLicenses(licenses);
      });
    }
  }, [session]);

  if (!licenses) {
    return <LoadingSpinner text="Loading..." />; // todo
  }

  return (
    <>
      <Toaster richColors />

      <div className="mx-2 overflow-y-auto">
        <div className={'rounded-lg border border-primary bg-secondary-light p-2 text-sm'}>
          <div className="flex flex-col">
            {licenses.map((license, index) => {
              return (
                <div key={index} className="m-1 flex items-center">
                  <div className="mx-1 flex w-1/2 justify-end">
                    <Link className="float-right" href={`${routeUsers}/${license.username}`}>
                      {license.username}
                    </Link>
                  </div>
                  <div className="mx-1 flex w-1/2 justify-start">
                    <>
                      <div className="mx-1 flex justify-start items-center">{license.amountEventLicenses}</div>
                      <div className="ml-1">
                        <ActionButton
                          action={Action.ADD}
                          onClick={() => {
                            handleUpdateLicenseClicked(license, 1);
                          }}
                        />
                      </div>
                      <div className="ml-1">
                        <ActionButton
                          action={Action.REMOVE}
                          onClick={() => {
                            handleUpdateLicenseClicked(license, -1);
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
