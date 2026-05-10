import { Header } from '@/components/header';
import Navigation from '@/components/navigation';
import PageTitle from '@/components/page-title';
import ActionButton from '@/components/common/action-button';
import SocialLink from '@/components/user/social-link';
import { routeContributors, routeDataProtection, routeDonate, routeFeedback, routeHome, routeImprint, routeTermsOfService } from '@/domain/constants/routes';
import { Action } from '@/domain/enums/action';
import { SocialPlatform } from '@/domain/enums/social-platform';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { readFileSync } from 'fs';
import path from 'path';
import Image from 'next/image';
import { PageInset } from '@/components/layout/page-inset';

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
    <div className="flex min-h-0 flex-1 flex-col">
      <Header />

      <PageTitle title={t('pageTitle')} />

      <PageInset variant="prose" className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto scrollbar-none">
        <div className="prose-flow select-text w-full break-words">
          <p>{t('aboutText1')}</p>
          <p>
            {t('aboutText2')}
            <Link href={routeFeedback} className="font-medium text-primary underline underline-offset-4">
              {t('aboutText3')}
            </Link>
            {t('aboutText4')}
          </p>

          <p className="not-prose mt-4">
            <SocialLink platform={SocialPlatform.INSTAGRAM} path={'@fsmeet_com'} />
          </p>

          <p>
            <Link href={routeDonate} className="font-medium text-primary underline underline-offset-4">
              {t('lnkDonate')}
            </Link>
          </p>

          <p className="not-prose mt-10 text-sm text-muted-foreground">{`${t('build')}: ${getPackageVersion()}`}</p>
          {shortSha && buildTime && (
            <>
              <p className="not-prose text-sm text-muted-foreground">{`Sha: ${shortSha}`}</p>
              <p className="not-prose text-sm text-muted-foreground">{buildTime}</p>
            </>
          )}

          <p className="not-prose mt-6">
            <a
              href="https://github.com/nilsfs7/fsmeet-frontend"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-col gap-1 text-sm text-foreground no-underline hover:underline"
            >
              <Image src="/github-logo.svg" width={120} height={32} className="h-8 w-auto" alt="" />
              <span>nilsfs7</span>
            </a>
          </p>

          <nav className="not-prose mt-8 flex flex-col gap-2 border-t border-border pt-6" aria-label="Legal">
            <Link href={routeContributors} className="font-medium text-primary underline underline-offset-4">
              {t('lnkContributors')}
            </Link>
            <Link href={routeImprint} className="font-medium text-primary underline underline-offset-4">
              {t('lnkImprint')}
            </Link>
            <Link href={routeTermsOfService} className="font-medium text-primary underline underline-offset-4">
              {t('lnkTermsOfService')}
            </Link>
            <Link href={routeDataProtection} className="font-medium text-primary underline underline-offset-4">
              {t('lnkPrivacyPolicy')}
            </Link>
          </nav>
        </div>
      </PageInset>

      <Navigation>
        <ActionButton href={routeHome} action={Action.BACK} />
      </Navigation>
    </div>
  );
}
