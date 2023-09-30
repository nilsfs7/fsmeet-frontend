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
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="m-4 text-center text-3xl">{displayName}</div>
        <div className="relative h-96 w-64">
          <img className="h-full w-full rounded-lg border border-primary object-cover shadow-xl shadow-primary" src={user.imageUrl ? user.imageUrl : imgUserDefaultImg} alt="user-image" />
        </div>

        <div className="mx-2 mt-6">
          {/* <div className="mb-2 flex">{user.firstName && user.lastName && <>{`${user.firstName} ${user.lastName}`}</>}</div> */}
          <div className="flex">
            <div className="mr-2">
              <SocialLink platform={Platform.FSMEET} path={user.username} />
            </div>
            {user.instagramHandle && (
              <div className="">
                <SocialLink platform={Platform.INSTAGRAM} path={user.instagramHandle} />
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
