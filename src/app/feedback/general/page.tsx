'use client';

import { useTranslations } from 'next-intl';
import { IconMessageCircle } from '@tabler/icons-react';
import { createFeedbackGeneral } from '@/infrastructure/clients/feedback.client';
import { FeedbackForm } from '../components/feedback-form';

export default function GeneralFeedback() {
  const t = useTranslations('/feedback/general');

  return (
    <FeedbackForm
      title={t('pageTitle')}
      description={t('pageDescription')}
      label={t('inputMessage')}
      placeholder={t('inputMessagePlaceholder')}
      submitText={t('btnSubmit')}
      icon={<IconMessageCircle stroke={1.75} aria-hidden />}
      tone="bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300"
      submit={createFeedbackGeneral}
    />
  );
}
