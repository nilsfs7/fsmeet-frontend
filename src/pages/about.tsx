import { Header } from '@/components/Header';
import Navigation from '@/components/Navigation';
import PageTitle from '@/components/PageTitle';
import ActionButton from '@/components/common/ActionButton';
import SocialLink from '@/components/user/SocialLink';
import { routeDataProtection, routeFeedback, routeHome, routeImprint } from '@/types/consts/routes';
import { Action } from '@/types/enums/action';
import { Platform } from '@/types/enums/platform';
import Link from 'next/link';

const About = () => {
  const buildTime = process.env.NEXT_PUBLIC_BUILD_TIME;
  const shortSha = process.env.NEXT_PUBLIC_COMMIT_SHA && process.env.NEXT_PUBLIC_COMMIT_SHA?.length > 7 ? process.env.NEXT_PUBLIC_COMMIT_SHA?.substring(0, 7) : process.env.NEXT_PUBLIC_COMMIT_SHA;

  return (
    <div className="absolute inset-0 flex flex-col">
      <Header />

      <PageTitle title="About" />

      <div className="mx-2 mt-2 flex flex-col items-center text-center overflow-y-auto">
        <div>{`FSMeet is a free tool to easily organize and manage freestyle football meetings and competitions.`}</div>
        <div className="mt-2">
          {`This is a community driven project. If you love freestyle as much as we do, we encourage you to send any feedback or ideas to further improve our service. You can reach out to us either
          using the `}
          <Link href={routeFeedback} className="underline">
            {`feedback function`}
          </Link>
          {` or drop us a DM on Instagram.`}
        </div>

        <div className="mt-4">
          <SocialLink platform={Platform.INSTAGRAM} path={'@fsmeet_com'} />
        </div>

        <div className="mt-20">
          <Link className="underline" href={routeImprint}>
            {`Impressum`}
          </Link>
        </div>
        <div>
          <Link className="underline" href={routeDataProtection}>
            {`Datenschutzerklärung`}
          </Link>
        </div>

        <div className="mt-20">{`Build: ${shortSha}`}</div>
        <div>{buildTime}</div>
      </div>

      <Navigation>
        <Link href={routeHome}>
          <ActionButton action={Action.BACK} />
        </Link>
      </Navigation>
    </div>
  );
};

export default About;
