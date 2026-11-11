import { ChoiceCard } from '@/components/common/choice-card';
import { IconBug, IconBulb, IconMessageCircle } from '@tabler/icons-react';
import Link from 'next/link';
import Navigation from '@/components/navigation';
import { routeHome } from '@/domain/constants/routes';
import ActionButton from '@/components/common/action-button';
import { Action } from '@/domain/enums/action';
import { getTranslations } from 'next-intl/server';
import PageTitle from '@/components/page-title';

export default async function Feedback() {
  const t = await getTranslations('/feedback');

  return (
    <div className="min-h-0 flex-1 flex flex-col">
      <PageTitle title={t('pageTitle')} />

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-content flex-col items-center px-4 py-4 sm:px-6 md:px-8">
          <div className="flex w-full max-w-2xl min-w-0 flex-col items-center gap-4">
            <p className="w-full text-balance text-center text-foreground">{t('pageDescription')}</p>
            <div className="grid w-full grid-cols-1 gap-3">
              <Link href="/feedback/general" className="rounded-2xl">
                <ChoiceCard asDiv title={t('pageGeneralFeedback')} Icon={IconMessageCircle} tone="bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300" />
              </Link>

              <Link href="/feedback/features" className="rounded-2xl">
                <ChoiceCard asDiv title={t('btnFeatures')} Icon={IconBulb} tone="bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300" />
              </Link>

              <Link href="/feedback/bugs" className="rounded-2xl">
                <ChoiceCard asDiv title={t('btnBugs')} Icon={IconBug} tone="bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Navigation>
        <ActionButton href={routeHome} action={Action.BACK} />
      </Navigation>
    </div>
  );
}
