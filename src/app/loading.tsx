import LoadingSpinner from '@/components/animation/loading-spinner';
import { getTranslations } from 'next-intl/server';

export default async function LoadingPage() {
  const t = await getTranslations('/loading');

  return <LoadingSpinner text={t('textLoading')} />;
}
