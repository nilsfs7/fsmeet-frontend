import MapOfFreestylers from '@/components/MapOfFreestylers';
import { getUsers } from '@/services/fsmeet-backend/get-users';
import { User } from '@/types/user';
import { GetServerSideProps } from 'next';

const FreestylersMap = ({ data }: { data: any }) => {
  const users: User[] = data;

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden">
      <div className="h-full">
        <MapOfFreestylers address={'Europe'} zoom={4} users={users} />
      </div>
    </div>
  );
};

export default FreestylersMap;

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  let data: User[] = [];
  try {
    data = await getUsers();
  } catch (error: any) {
    console.error('Error fetching users.');
  }

  return {
    props: {
      data: data,
    },
  };
};
