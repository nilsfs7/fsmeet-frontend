import { imgNotFound } from '@/types/consts/images';
import Link from 'next/link';
import Image from 'next/image';
import { routeEvents } from '@/types/consts/routes';
import TextButton from '@/components/common/TextButton';

const EventNotFound = () => {
  return (
    <div className={'absolute inset-0 flex flex-col items-center justify-center'}>
      <div className="py-2 ">
        <Image src={imgNotFound} width={0} height={0} sizes="100vw" className={`h-12 w-full`} alt={'image'} priority={true} />
        <div className="m-1 text-center text-lg font-bold">
          <div>{`Event not found.`}</div>
        </div>
      </div>

      <div className="py-2">
        <Link href={routeEvents}>
          <TextButton text="Back To Overview" />
        </Link>
      </div>
    </div>
  );
};

export default EventNotFound;
