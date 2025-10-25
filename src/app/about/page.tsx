import { Header } from '@/components/header';
import Navigation from '@/components/navigation';
import PageTitle from '@/components/page-title';
import ActionButton from '@/components/common/action-button';
import SocialLink from '@/components/user/social-link';
import { routeContributors, routeDataProtection, routeDonate, routeFeedback, routeHome, routeImprint } from '@/domain/constants/routes';
import { Action } from '@/domain/enums/action';
import { Platform } from '@/domain/enums/platform';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { readFileSync } from 'fs';
import path from 'path';
import Image from 'next/image';

export default async function About() {
  const t = await getTranslations('/about');

  const buildTime = process.env.NEXT_PUBLIC_BUILD_TIME;
  const shortSha = process.env.NEXT_PUBLIC_COMMIT_SHA && process.env.NEXT_PUBLIC_COMMIT_SHA?.length > 7 ? process.env.NEXT_PUBLIC_COMMIT_SHA?.substring(0, 7) : process.env.NEXT_PUBLIC_COMMIT_SHA;

  const getPackageVersion = (): string => {
    const filePath = path.resolve(process.cwd(), 'package.json');
    const packageJson = JSON.parse(readFileSync(filePath, 'utf-8'));
    return packageJson.version;
  };

  return (
    <div className="h-[calc(100dvh)] flex flex-col">
      <Header />

      <PageTitle title={t('pageTitle')} />

      <div className="mx-2 mt-2 flex flex-col items-center text-center overflow-y-auto">
        <div>{t('aboutText1')}</div>
        <div className="mt-2">
          {t('aboutText2')}
          <Link href={routeFeedback} className="underline">
            {t('aboutText3')}
          </Link>
          {t('aboutText4')}
        </div>

        <div className="mt-2">
          <SocialLink platform={Platform.INSTAGRAM} path={'@fsmeet_com'} />
        </div>

        <Link className="mt-6 underline" href={routeDonate}>
          {t('lnkDonate')}
        </Link>

        <div className="mt-10">{`${t('build')}: ${getPackageVersion()}`}</div>
        {shortSha && buildTime && (
          <>
            <div>{`Sha: ${shortSha}`}</div>
            <div>{buildTime}</div>
          </>
        )}

        <div className="mt-2">
          <a href={'https://github.com/nilsfs7/fsmeet-frontend'} target="_blank" rel="noopener noreferrer">
            <div className="flex flex-col items-center text-sm">
              <Image src={'github-logo.svg'} width={0} height={0} sizes="100vw" className={`h-8 w-full`} alt={''} />
              <div className="hover:underline">{`nilsfs7`}</div>
            </div>
          </a>
        </div>

        <Link className="mt-6 underline" href={routeContributors}>
          {t('lnkContributors')}
        </Link>

        <Link className="underline" href={routeImprint}>
          {t('lnkImprint')}
        </Link>

        <Link className="underline" href={routeDataProtection}>
          {t('lnkPrivacyPolicy')}
        </Link>
      </div>

      <Navigation>
        <Link href={routeHome}>
          <ActionButton action={Action.BACK} />
        </Link>
      </Navigation>
    </div>
  );
}
