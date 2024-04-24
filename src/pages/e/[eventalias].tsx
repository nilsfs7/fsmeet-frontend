import TextButton from '@/components/common/TextButton';
import { getEventByAlias } from '@/services/fsmeet-backend/get-event-by-alias';
import Image from 'next/image';
import { imgNotFound } from '@/types/consts/images';
import { routeEvents, routeHome } from '@/types/consts/routes';
import { GetServerSidePropsContext } from 'next';
import Link from 'next/link';

const EventAlias = () => {
  return (
    <div className={'absolute inset-0 flex flex-col items-center justify-center'}>
      <div className="py-2 ">
        <Image src={imgNotFound} width={0} height={0} sizes="100vw" className={`h-12 w-full`} alt={'image'} />
        <div className="m-1 text-center text-lg font-bold">
          <div>{`Event not found.`}</div>
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

export default EventAlias;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const alias = context.params?.eventalias;

  // TODO: bug -> url funktioniert nicht für events ohne public state
  if (alias) {
    try {
      const event = await getEventByAlias(alias.toString());

      if (event.id) {
        return {
          redirect: {
            permanent: false,
            destination: `${routeEvents}/${event.id}`,
          },
          props: {},
        };
      }
    } catch (error: any) {
      console.error('Error fetching event by alias.');
    }
  }

  return {
    props: {},
  };
};
