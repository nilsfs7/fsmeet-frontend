import { routeHome } from '@/domain/constants/routes';
import { getTranslations } from 'next-intl/server';
import { FeedbackThankYou } from '../components/feedback-thankyou';

export default async function ThankYou() {
  const t = await getTranslations('/feedback/thankyou');

  return <FeedbackThankYou href={routeHome} buttonLabel={t('btnBackHome')} title={t('thankYouText1')} description={t('thankYouText2')} />;
}
