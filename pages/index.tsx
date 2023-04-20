import Button from '@/components/common/Button';
import { NextPage } from 'next';
import Link from 'next/link';

const CreateJury: NextPage = () => {
  return (
    <div className="flex h-screen flex-col justify-center">
      <div className="flex justify-center py-2">
        <Link href={'/results/'}>
          <Button text="Show Results" />
        </Link>
      </div>
      <div className="flex justify-center py-2">
        <Link href={'/jury/create'}>
          <Button text="Create Jury" />
        </Link>
      </div>
      <div className="flex justify-center py-2">
        <Link href={'/'}>
          <Button text="Join Jury" />
        </Link>
      </div>
    </div>
  );
};

export default CreateJury;
