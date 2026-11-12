import { HubLinks } from '@/components/common/hub-links';
import { IconBug, IconBulb, IconMessageCircle } from '@tabler/icons-react';
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
      <PageTitle title={t('pageTitle')} description={t('pageDescription')} />

      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6 sm:px-6 md:px-8">
        <div className="mx-auto w-full max-w-4xl">
          <HubLinks
            columns={3}
            links={[
              {
                href: '/feedback/general',
                title: t('pageGeneralFeedback'),
                description: t('descGeneral'),
                Icon: IconMessageCircle,
                tone: 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300',
              },
              { href: '/feedback/features', title: t('btnFeatures'), description: t('descFeatures'), Icon: IconBulb, tone: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300' },
              { href: '/feedback/bugs', title: t('btnBugs'), description: t('descBugs'), Icon: IconBug, tone: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300' },
            ]}
          />
        </div>
      </div>

      <Navigation>
        <ActionButton href={routeHome} action={Action.BACK} />
      </Navigation>
    </div>
  );
}
