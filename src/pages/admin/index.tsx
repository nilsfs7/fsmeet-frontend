import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { Action } from '@/types/enums/action';
import Link from 'next/link';
import { routeAdminEvents, routeAdminLicenses, routeAdminUsers, routeHome, routeLogin } from '@/types/consts/routes';
import { validateSession } from '@/types/funcs/validate-session';
import ActionButton from '@/components/common/ActionButton';
import Navigation from '@/components/Navigation';
import TextButton from '@/components/common/TextButton';

const AdminOverview = () => {
  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden">
      <div className="m-2 text-center text-base font-bold">{`Admin Overview`}</div>

      <div className="m-2 flex items-center flex-col gap-2">
        <Link href={routeAdminEvents}>
          <TextButton text={'Events'} />
        </Link>

        <Link href={routeAdminLicenses}>
          <TextButton text={'Licences'} />
        </Link>

        <Link href={routeAdminUsers}>
          <TextButton text={'Users'} />
        </Link>
      </div>

      <Navigation>
        <Link href={routeHome}>
          <ActionButton action={Action.BACK} />
        </Link>
      </Navigation>
    </div>
  );
};

export default AdminOverview;

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
