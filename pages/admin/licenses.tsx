import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { Action } from '@/types/enums/action';
import Link from 'next/link';
import { routeHome, routeLogin } from '@/types/consts/routes';

import { validateSession } from '@/types/funcs/validate-session';
import ActionButton from '@/components/common/ActionButton';
import { getLicenses } from '@/services/fsmeet-backend/get-licenses';
import { License } from '@/types/license';
import { updateLicense } from '@/services/fsmeet-backend/update-license';
import Navigation from '@/components/Navigation';

const Licenses = (props: any) => {
  const session = props.session;

  const router = useRouter();

  const [licenses, setLicenses] = useState<License[]>([]);

  const handleUpdateLicenseClicked = async (license: License, diff: number) => {
    if (!validateSession(session)) {
      router.push(routeLogin);
      return;
    }

    const newAmount = license.amountEventLicenses + diff;
    if (newAmount >= 0 && newAmount < 100) {
      let lics = Array.from(licenses);
      lics = lics.map(lic => {
        if (lic.username === license.username) {
          lic.amountEventLicenses = newAmount;
        }

        return lic;
      });
      setLicenses(lics);
      const response = await updateLicense(session, license);
      if (response.status == 200) {
        console.info(`Licenses for ${license.username} updated`);
      }
    }
  };

  useEffect(() => {
    getLicenses(session).then(licenses => {
      setLicenses(licenses);
    });
  }, [licenses == undefined]);

  if (!licenses) {
    return <>loading...</>;
  }

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden">
      <div className="m-2 text-center text-base font-bold">Manage Licenses</div>

      <div className="m-2 overflow-y-auto">
        <div className={'rounded-lg border border-primary bg-secondary-light p-2 text-sm'}>
          <div className="flex flex-col">
            {licenses.map((license, index) => {
              return (
                <div key={index} className="m-1 flex items-center">
                  <div className="mx-1 flex w-1/2 justify-end">
                    <Link className="float-right" href={`/user/${license.username}`}>
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

      <Navigation>
        <Link href={routeHome}>
          <ActionButton action={Action.BACK} />
        </Link>
      </Navigation>
    </div>
  );
};

export default Licenses;

export const getServerSideProps: GetServerSideProps = async (context: any) => {
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
