'use client';

import { useTranslations } from 'next-intl';
import { IconBulb } from '@tabler/icons-react';
import { createFeedbackFeature } from '@/infrastructure/clients/feedback.client';
import { FeedbackForm } from '../components/feedback-form';

export default function FeatureRequest() {
  const t = useTranslations('/feedback/features');

  return (
    <FeedbackForm
      title={t('pageTitle')}
      description={t('pageDescription')}
      label={t('inputMessage')}
      placeholder={t('inputMessagePlaceholder')}
      submitText={t('btnSubmit')}
      icon={<IconBulb stroke={1.75} aria-hidden />}
      tone="bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
      submit={createFeedbackFeature}
    />
  );
}
