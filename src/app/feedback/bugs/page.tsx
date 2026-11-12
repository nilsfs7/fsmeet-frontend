'use client';

import { useTranslations } from 'next-intl';
import { IconBug } from '@tabler/icons-react';
import { createFeedbackBug } from '@/infrastructure/clients/feedback.client';
import { FeedbackForm } from '../components/feedback-form';

export default function ReportBug() {
  const t = useTranslations('/feedback/bugs');

  return (
    <FeedbackForm
      title={t('pageTitle')}
      description={t('pageDescription')}
      label={t('inputMessage')}
      placeholder={t('inputMessagePlaceholder')}
      submitText={t('btnSubmit')}
      icon={<IconBug stroke={1.75} aria-hidden />}
      tone="bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300"
      submit={createFeedbackBug}
    />
  );
}
