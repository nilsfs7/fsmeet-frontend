import SocialLink from '@/components/user/SocialLink';
import { imgUserDefaultImg } from '@/types/consts/images';
import { Platform } from '@/types/enums/platform';
import { User } from '@/types/user';
import { GetServerSideProps } from 'next';

const Profile = (props: any) => {
  const user: User = props.data;

  let displayName = user.firstName ? `${user.firstName}` : `${user.username}`;
  if (user.lastName) {
    displayName = `${displayName}`;
  }

  return (
    <div className="absolute inset-0 flex justify-center">
      <div className="flex flex-col items-center justify-center">
        <div className="m-2 text-3xl">{user.username}</div>

        <div>
          <div className="flex h-96 w-64">
            <img className="h-full w-full rounded-lg border border-primary object-cover shadow-xl shadow-primary" src={user.imageUrl ? user.imageUrl : imgUserDefaultImg} alt="user-image" />
          </div>

          <div className="mx-1 mt-6">
            {user.firstName && user.lastName && <div className="mx-1 mb-2">{`${user.firstName} ${user.lastName}`}</div>}
            {user.firstName && !user.lastName && <div className="mx-1 mb-2">{`${user.firstName}`}</div>}

            {user.instagramHandle && (
              <div className="w-fit">
                <SocialLink platform={Platform.INSTAGRAM} path={user.instagramHandle} />
              </div>
            )}

            {user.youTubeHandle && (
              <div className="mt-2 w-fit">
                <SocialLink platform={Platform.YOUTUBE} path={user.youTubeHandle} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/users/${context.params.username}`);
  const data = await response.json();

  return {
    props: {
      data: data,
    },
  };
};
