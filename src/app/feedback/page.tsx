import TextAndImageButton from '@/components/common/text-and-image-button';
import Link from 'next/link';
import { imgBug, imgFeature, imgFeedback } from '@/domain/constants/images';
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
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
              <Link href="/feedback/general">
                <TextAndImageButton text={t('pageGeneralFeedback')} image={imgFeedback} />
              </Link>

              <Link href="/feedback/features">
                <TextAndImageButton text={t('btnFeatures')} image={imgFeature} />
              </Link>

              <Link href="/feedback/bugs">
                <TextAndImageButton text={t('btnBugs')} image={imgBug} />
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
