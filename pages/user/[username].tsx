import Navigation from '@/components/Navigation';
import ActionButton from '@/components/common/ActionButton';
import SocialLink from '@/components/user/SocialLink';
import { imgUserDefaultImg, imgVerifiedCheckmark } from '@/types/consts/images';
import { routeAccount } from '@/types/consts/routes';
import { Action } from '@/types/enums/action';
import { Platform } from '@/types/enums/platform';
import { User } from '@/types/user';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Profile = (props: any) => {
  const session = props.session;
  const user: User = props.data;

  const router = useRouter();

  let displayName = user.firstName ? `${user.firstName}` : `${user.username}`;
  if (user.lastName) {
    displayName = `${displayName}`;
  }

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden">
      <div className="overflow-hidden overflow-y-auto h-full">
        <div className="flex flex-col items-center justify-center">
          <div className="m-2 text-3xl">{user.username}</div>

          <div>
            <div className="flex h-96 w-64">
              <img className="h-full w-full rounded-lg border border-primary object-cover shadow-xl shadow-primary" src={user.imageUrl ? user.imageUrl : imgUserDefaultImg} alt="user-image" />
            </div>

            <div className="mx-1 mt-6">
              <div className="h-8 flex items-center">
                {user.firstName && user.lastName && <div className="mx-1">{`${user.firstName} ${user.lastName}`}</div>}
                {user.firstName && !user.lastName && <div className="mx-1">{`${user.firstName}`}</div>}
                {user.isVerifiedAccount && <img className="h-8 p-1 hover:p-0" src={imgVerifiedCheckmark} alt="user verified checkmark" />}
              </div>

              {user.instagramHandle && (
                <div className="mt-1">
                  <SocialLink platform={Platform.INSTAGRAM} path={user.instagramHandle} />
                </div>
              )}

              {user.tikTokHandle && (
                <div className="mt-1">
                  <SocialLink platform={Platform.TIKTOK} path={user.tikTokHandle} />
                </div>
              )}

              {user.youTubeHandle && (
                <div className="mt-1">
                  <SocialLink platform={Platform.YOUTUBE} path={user.youTubeHandle} />
                </div>
              )}

              {user.website && (
                <div className="mt-1">
                  <SocialLink platform={Platform.WEBSITE} path={user.website} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Navigation>
        {/* <Link href={routeHome}> */}
        <ActionButton action={Action.BACK} onClick={() => router.back()} />
        {/* </Link> */}

        {session?.user?.username === user.username && (
          <Link href={routeAccount}>
            <ActionButton action={Action.EDIT} />
          </Link>
        )}
      </Navigation>
    </div>
  );
};

export default Profile;

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const session = await getSession(context);

  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/users/${context.params.username}`);
  const data = await response.json();

  return {
    props: {
      data: data,
      session: session,
    },
  };
};
