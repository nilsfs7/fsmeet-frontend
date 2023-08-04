import { NextPage } from 'next';
import Link from 'next/link';
import TextButton from '@/components/common/TextButton';
import Image from 'next/image';

const thumbsUpImg = '/feedback/thumbs-up.svg';

const ThankYou: NextPage = () => {
  return (
    <div className={'absolute inset-0 flex flex-col items-center justify-center'}>
      <div className="py-2 ">
        <Image src={thumbsUpImg} width={0} height={0} sizes="100vw" className={`h-12 w-full`} alt={'image'} />
        <div className="m-1 text-center text-lg font-bold text-black">
          <div>Thank you!</div>
          <div>Your feedback is highly appreciated!</div>
        </div>
      </div>

      <div className="py-2">
        <Link href="/">
          <TextButton text="Back to home" />
        </Link>
      </div>
    </div>
  );
};

export default ThankYou;
