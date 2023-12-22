import { GetServerSideProps, NextPage } from 'next';
import TextAndImageButton from '@/components/common/TextAndImageButton';
import Link from 'next/link';
import { imgBug, imgFeature, imgFeedback } from '@/types/consts/images';
import Navigation from '@/components/Navigation';
import { routeHome } from '@/types/consts/routes';
import ActionButton from '@/components/common/ActionButton';
import { Action } from '@/types/enums/action';
import { getSession } from 'next-auth/react';
import { validateSession } from '@/types/funcs/validate-session';

const Feedback: NextPage = () => {
  return (
    <div className={'absolute inset-0 flex flex-col'}>
      <div className="flex h-full flex-col items-center justify-center">
        <div className="py-2">
          <Link href="feedback/bugs">
            <TextAndImageButton text="Report Bug" image={imgBug} />
          </Link>
        </div>
        <div className="py-2">
          <Link href="feedback/features">
            <TextAndImageButton text="Request Feature" image={imgFeature} />
          </Link>
        </div>
        <div className="py-2">
          <Link href="feedback/general">
            <TextAndImageButton text="General Feedback" image={imgFeedback} />
          </Link>
        </div>
      </div>

      <Navigation>
        <Link href={routeHome}>
          <ActionButton action={Action.BACK} />
        </Link>
      </Navigation>
    </div>
  );
};

export default Feedback;

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const session = await getSession(context);

  if (!validateSession(session)) {
    return {
      redirect: {
        permanent: false,
        destination: '/login',
      },
    };
  }

  return {
    props: {
      session: session,
    },
  };
};
