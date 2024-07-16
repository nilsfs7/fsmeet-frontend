import TextAndImageButton from '@/components/common/TextAndImageButton';
import Link from 'next/link';
import { imgBug, imgFeature, imgFeedback } from '@/types/consts/images';
import Navigation from '@/components/Navigation';
import { routeHome, routeLogin } from '@/types/consts/routes';
import ActionButton from '@/components/common/ActionButton';
import { Action } from '@/types/enums/action';
import { validateSession } from '@/types/funcs/validate-session';
import { GetServerSidePropsContext } from 'next';
import { auth } from '@/auth';

const Feedback = () => {
  return (
    <div className={'absolute inset-0 flex flex-col'}>
      <div className="p-2 h-full grid overflow-y-auto">
        <div className="h-full flex flex-col items-center justify-center gap-2">
          <Link href="feedback/general">
            <TextAndImageButton text="General Feedback" image={imgFeedback} />
          </Link>

          <Link href="feedback/features">
            <TextAndImageButton text="Request Feature" image={imgFeature} />
          </Link>

          <Link href="feedback/bugs">
            <TextAndImageButton text="Report Bug" image={imgBug} />
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

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await auth(context);

  if (!validateSession(session)) {
    return {
      redirect: {
        permanent: false,
        destination: routeLogin,
      },
    };
  }

  return {
    props: {
      session: session,
    },
  };
};
