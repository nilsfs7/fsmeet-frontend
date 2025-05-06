import { Header } from '@/components/Header';
import Navigation from '@/components/Navigation';
import PageTitle from '@/components/PageTitle';
import ActionButton from '@/components/common/ActionButton';
import SocialLink from '@/components/user/SocialLink';
import { routeContributors, routeDataProtection, routeFeedback, routeHome, routeImprint } from '@/domain/constants/routes';
import { Action } from '@/domain/enums/action';
import { Platform } from '@/domain/enums/platform';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { readFileSync } from 'fs';
import path from 'path';

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

        <div className="mt-4">
          <SocialLink platform={Platform.INSTAGRAM} path={'@fsmeet_com'} />
        </div>

        <Link className="mt-6 underline" href={routeContributors}>
          {t('lnkContributors')}
        </Link>

        <Link className="mt-20 underline" href={routeImprint}>
          {t('lnkImprint')}
        </Link>

        <Link className="underline" href={routeDataProtection}>
          {t('lnkPrivacyPolicy')}
        </Link>

        <div className="mt-20">{`${t('build')}: ${getPackageVersion()}`}</div>
        {shortSha && buildTime && (
          <>
            <div>{`Sha: ${shortSha}`}</div>
            <div>{buildTime}</div>
          </>
        )}
      </div>

      <Navigation>
        <Link href={routeHome}>
          <ActionButton action={Action.BACK} />
        </Link>
      </Navigation>
    </div>
  );
}
