import Navigation from '@/components/navigation';
import { heroSurfaceClassName } from '@/lib/hero-surface';
import ActionButton from '@/components/common/action-button';
import { routeContributors, routeDataProtection, routeDonate, routeFeedback, routeHome, routeImprint, routeTermsOfService } from '@/domain/constants/routes';
import { Action } from '@/domain/enums/action';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { readFileSync } from 'fs';
import path from 'path';
import Image from 'next/image';
import type { ReactNode } from 'react';
import { PageInset } from '@/components/layout/page-inset';
import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { imgInstagramLogo } from '@/domain/constants/images';
import { IconArrowRight, IconArrowUpRight, IconBrandGithub, IconHeartHandshake, IconMessageCircle, IconUsersGroup } from '@tabler/icons-react';

function AboutCard({ icon, tone, title, children, actions }: { icon: ReactNode; tone: string; title: string; children: ReactNode; actions?: ReactNode }) {
  return (
    <section className="flex min-w-0 flex-col gap-4 rounded-3xl border border-border bg-background p-5 shadow-xs sm:p-6">
      <div className="flex items-center gap-3">
        <span className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl [&>svg]:h-5 [&>svg]:w-5', tone)}>{icon}</span>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      </div>
      <div className="flex-1 text-sm leading-relaxed text-muted-foreground sm:text-base">{children}</div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </section>
  );
}

const outlineLinkClass = 'h-10 rounded-xl px-4';

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
      <div className="min-h-0 flex-1 overflow-y-auto">
        <PageInset className="flex flex-col gap-6 pb-6 pt-4 sm:gap-8 sm:pt-8">
          {/* hero */}
          <section className={cn(heroSurfaceClassName, 'px-6 py-10 sm:px-10 sm:py-12')}>
            <div className="relative flex max-w-2xl flex-col gap-4">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-wider text-white/80">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                {t('heroEyebrow')}
              </span>
              <h1 className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">{t('pageTitle')}</h1>
              <p className="select-text text-lg text-white/75">{t('aboutText1')}</p>
            </div>
          </section>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <AboutCard
              icon={<IconMessageCircle stroke={1.75} aria-hidden />}
              tone="bg-brand-soft text-brand-strong"
              title={t('sectionGetInvolved')}
              actions={
                <>
                  <Button asChild variant="action" className={cn(ctaActionButtonClassName, 'h-10 min-w-0')}>
                    <Link href={routeFeedback}>
                      {t('btnFeedback')}
                      <IconArrowRight className="h-4 w-4" stroke={2} aria-hidden />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className={outlineLinkClass}>
                    <a href="https://www.instagram.com/fsmeet_com" target="_blank" rel="noopener noreferrer">
                      <img src={imgInstagramLogo} alt="" className="h-5 w-5" />
                      @fsmeet_com
                    </a>
                  </Button>
                </>
              }
            >
              <p className="select-text">
                {t('aboutText2')}
                <Link href={routeFeedback} className="font-medium text-brand-strong underline underline-offset-4">
                  {t('aboutText3')}
                </Link>
                {t('aboutText4')}
              </p>
            </AboutCard>

            <AboutCard
              icon={<IconHeartHandshake stroke={1.75} aria-hidden />}
              tone="bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300"
              title={t('sectionSupport')}
              actions={
                <Button asChild variant="outline" className={outlineLinkClass}>
                  <Link href={routeDonate}>
                    {t('lnkDonate')}
                    <IconArrowRight className="h-4 w-4" stroke={2} aria-hidden />
                  </Link>
                </Button>
              }
            >
              <p>{t('supportText')}</p>
            </AboutCard>

            <AboutCard
              icon={<IconUsersGroup stroke={1.75} aria-hidden />}
              tone="bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300"
              title={t('lnkContributors')}
              actions={
                <Button asChild variant="outline" className={outlineLinkClass}>
                  <Link href={routeContributors}>
                    {t('btnShowContributors')}
                    <IconArrowRight className="h-4 w-4" stroke={2} aria-hidden />
                  </Link>
                </Button>
              }
            >
              <p>{t('contributorsText')}</p>
            </AboutCard>

            <AboutCard
              icon={<IconBrandGithub stroke={1.75} aria-hidden />}
              tone="bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
              title={t('sectionOpenSource')}
              actions={
                <Button asChild variant="outline" className={outlineLinkClass}>
                  <a href="https://github.com/nilsfs7/fsmeet-frontend" target="_blank" rel="noopener noreferrer">
                    <Image src="/github-logo.svg" width={20} height={20} className="h-5 w-5" alt="" />
                    nilsfs7
                    <IconArrowUpRight className="h-4 w-4 opacity-60" stroke={1.75} aria-hidden />
                  </a>
                </Button>
              }
            >
              <p>{t('openSourceText')}</p>
              <dl className="mt-3 flex flex-wrap gap-2 text-xs">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-2.5 py-1">
                  <dt className="text-muted-foreground">{t('build')}</dt>
                  <dd className="font-medium text-foreground">{getPackageVersion()}</dd>
                </div>
                {shortSha && buildTime && (
                  <>
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-2.5 py-1">
                      <dt className="text-muted-foreground">Sha</dt>
                      <dd className="font-mono font-medium text-foreground">{shortSha}</dd>
                    </div>
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-2.5 py-1">
                      <dd className="font-medium text-foreground">{buildTime}</dd>
                    </div>
                  </>
                )}
              </dl>
            </AboutCard>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-2 border-t border-border pt-6" aria-label={t('ariaLegal')}>
            {[
              { href: routeImprint, label: t('lnkImprint') },
              { href: routeTermsOfService, label: t('lnkTermsOfService') },
              { href: routeDataProtection, label: t('lnkPrivacyPolicy') },
            ].map(l => (
              <Link key={l.href} href={l.href} className="rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                {l.label}
              </Link>
            ))}
          </nav>
        </PageInset>
      </div>

      <Navigation>
        <ActionButton href={routeHome} action={Action.BACK} />
      </Navigation>
    </div>
  );
}
