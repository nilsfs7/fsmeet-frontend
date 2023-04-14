import MenuButton from '@/components/common/MenuButton';
import { NextPage } from 'next';
import Link from 'next/link';

const CreateJury: NextPage = () => {
  return (
    <div className="flex h-screen flex-col justify-center">
      <div className="flex justify-center py-2">
        <Link href={'/results/'}>
          <MenuButton text="Show Results" />
        </Link>
      </div>
      <div className="flex justify-center py-2">
        <Link href={'/jury/create'}>
          <MenuButton text="Create Jury" />
        </Link>
      </div>
      <div className="flex justify-center py-2">
        <Link href={'/'}>
          <MenuButton text="Join Jury" />
        </Link>
      </div>
    </div>
  );
};

export default CreateJury;
