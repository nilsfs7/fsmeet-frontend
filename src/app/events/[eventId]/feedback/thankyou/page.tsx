import { routeEvents } from '@/domain/constants/routes';
import { getTranslations } from 'next-intl/server';
import { FeedbackThankYou } from '@/app/feedback/components/feedback-thankyou';

export default async function EventFeedbackThankYou(props: { params: Promise<{ eventId: string }> }) {
  const params = await props.params;
  const t = await getTranslations('/feedback/thankyou');
  const tEvent = await getTranslations('/events/eventid/registration/completed');

  return (
    <FeedbackThankYou
      href={`${routeEvents}/${params.eventId}`}
      buttonLabel={tEvent('btnBack')}
      title={t('thankYouText1')}
      description={t('thankYouText2')}
    />
  );
}
