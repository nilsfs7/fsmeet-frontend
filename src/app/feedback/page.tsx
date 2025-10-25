import TextAndImageButton from '@/components/common/text-and-image-button';
import Link from 'next/link';
import { imgBug, imgFeature, imgFeedback } from '@/domain/constants/images';
import Navigation from '@/components/navigation';
import { routeHome } from '@/domain/constants/routes';
import ActionButton from '@/components/common/action-button';
import { Action } from '@/domain/enums/action';
import { getTranslations } from 'next-intl/server';

export default async function Feedback() {
  const t = await getTranslations('/feedback');

  return (
    <div className={'absolute inset-0 flex flex-col'}>
      <div className="p-2 h-full grid overflow-y-auto">
        <div className="h-full flex flex-col items-center justify-center gap-2">
          <Link href="feedback/general">
            <TextAndImageButton text={t('pageGeneralFeedback')} image={imgFeedback} />
          </Link>

          <Link href="feedback/features">
            <TextAndImageButton text={t('btnFeatures')} image={imgFeature} />
          </Link>

          <Link href="feedback/bugs">
            <TextAndImageButton text={t('btnBugs')} image={imgBug} />
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
}
