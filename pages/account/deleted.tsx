import { NextPage } from 'next';
import Link from 'next/link';
import TextButton from '@/components/common/TextButton';
import Image from 'next/image';
import { routeHome } from '@/types/consts/routes';
import { imgGoodBye } from '@/types/consts/images';

const ThankYou: NextPage = () => {
  return (
    <div className={'absolute inset-0 flex flex-col items-center justify-center'}>
      <div className="py-2 ">
        <Image src={imgGoodBye} width={0} height={0} sizes="100vw" className={`h-12 w-full`} alt={'image'} />
        <div className="m-1 text-center text-lg font-bold">
          <div>Goodbye!</div>
          <div>Your account was successfully deleted.</div>
        </div>
      </div>

      <div className="py-2">
        <Link href={routeHome}>
          <TextButton text="Back to home" />
        </Link>
      </div>
    </div>
  );
};

export default ThankYou;
