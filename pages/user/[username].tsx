import { imgUserDefaultImg } from '@/types/consts/images';
import { User } from '@/types/user';
import { GetServerSideProps } from 'next';

const Profile = (props: any) => {
  const user: User = props.data;

  let displayName = user.firstName ? user.firstName : user.username;
  if (user.lastName) {
    displayName = `${displayName} ${user.lastName}`;
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="m-2 grid place-items-center">
        <div className="m-2 text-5xl">{displayName}</div>
        <div className="relative h-96 w-64">
          <img className="h-full w-full rounded-lg border border-black object-cover shadow-2xl shadow-black" src={user.imageUrl ? user.imageUrl : imgUserDefaultImg} alt="user-image" />
          {user.instagramHandle && (
            <div className={`absolute bottom-3 right-3 rounded-lg border border-black bg-white p-1`}>
              <a className="underline" href={`https://www.instagram.com/${user.instagramHandle.replace('@', '')}`}>
                {user.instagramHandle}
              </a>
            </div>
          )}
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
