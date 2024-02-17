import { LogoFSMeet } from '@/components/Logo';
import Navigation from '@/components/Navigation';
import ActionButton from '@/components/common/ActionButton';
import SocialLink from '@/components/user/SocialLink';
import { routeDataProtection, routeHome, routeImprint } from '@/types/consts/routes';
import { Action } from '@/types/enums/action';
import { Platform } from '@/types/enums/platform';
import { NextPage } from 'next';
import Link from 'next/link';

const About: NextPage = () => {
  const buildTime = process.env.NEXT_PUBLIC_BUILD_TIME;
  const shortSha = process.env.NEXT_PUBLIC_COMMIT_SHA && process.env.NEXT_PUBLIC_COMMIT_SHA?.length > 7 ? process.env.NEXT_PUBLIC_COMMIT_SHA?.substring(0, 7) : process.env.NEXT_PUBLIC_COMMIT_SHA;

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden">
      {/* Banner */}
      <div className="sm:block">
        <div className="mx-2 flex h-20 items-center justify-between">
          <LogoFSMeet />
        </div>
      </div>

      <div className="mx-2 mt-2 flex flex-col items-center text-center">
        <div>FSMeet is a free tool to easily organize and manage freestyle football meetings and competitions. Event creation will soon be available for everyone.</div>
        <div>Stay tuned! ⚽</div>

        <div className="mt-6">
          <SocialLink platform={Platform.INSTAGRAM} path={'@fsmeet_com'}></SocialLink>
        </div>

        <div className="mt-20">{`Build: ${shortSha}`}</div>
        <div>{buildTime}</div>

        <div className="mt-20">
          <Link className="underline" href={routeImprint}>
            Impressum
          </Link>
        </div>
        <div>
          <Link className="underline" href={routeDataProtection}>
            Datenschutzerklärung
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

export default About;
