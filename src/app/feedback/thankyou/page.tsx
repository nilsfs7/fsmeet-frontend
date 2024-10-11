import Link from 'next/link';
import { imgThumbsUp } from '@/domain/constants/images';
import { routeHome } from '@/domain/constants/routes';
import Image from 'next/image';
import TextButton from '@/components/common/TextButton';

export default function ThankYou() {
  return (
    <div className={'absolute inset-0 flex flex-col items-center justify-center'}>
      <div className="py-2 ">
        <Image src={imgThumbsUp} width={0} height={0} sizes="100vw" className={`h-12 w-full`} alt={'image'} />
        <div className="m-1 text-center text-lg font-bold">
          <div>{`Thank you!`}</div>
          <div>{`Your feedback is highly appreciated!`}</div>
        </div>
      </div>

      <div className="py-2">
        <Link href={routeHome}>
          <TextButton text="Back to home" />
        </Link>
      </div>
    </div>
  );
}
