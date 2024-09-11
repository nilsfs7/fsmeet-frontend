'use client';

import { imgNotFound } from '@/types/consts/images';
import { routeHome } from '@/types/consts/routes';

import { useEffect } from 'react';
import Image from 'next/image';
import TextButton from '@/components/common/TextButton';
import Link from 'next/link';

export default function ErrorPage({ error }: { error: Error }) {
  useEffect(() => {
    console.error(`${error}`);
  }, [error]);

  return (
    <div className={'absolute inset-0 flex flex-col items-center justify-center'}>
      <div className="py-2 ">
        <Image src={imgNotFound} width={0} height={0} sizes="100vw" className={`h-12 w-full`} alt={'image'} priority={true} />
        <div className="m-1 text-center text-lg font-bold">
          <div>{`Some error occurred.`}</div>
        </div>
      </div>

      <div className="py-2">
        <Link href={routeHome}>
          <TextButton text="Back To Home" />
        </Link>
      </div>
    </div>
  );
}
