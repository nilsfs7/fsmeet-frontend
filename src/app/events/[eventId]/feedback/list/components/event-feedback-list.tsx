'use client';

import { IconMessageCircle } from '@tabler/icons-react';
import { useLocale, useTranslations } from 'next-intl';
import { EmptyState } from '@/components/common/empty-state';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ReadEventFeedbackResponseDto } from '@/infrastructure/clients/dtos/event/read-event-feedback.response.dto';
import { isValidDate, toDate } from '@/lib/date';
import { toIntlLocale } from '@/lib/format-date';

interface EventFeedbackListProps {
  feedbacks: ReadEventFeedbackResponseDto[];
}

/** Newest first; entries without a valid date go last. */
function sortNewestFirst(feedbacks: ReadEventFeedbackResponseDto[]) {
  const time = (feedback: ReadEventFeedbackResponseDto) => {
    const date = toDate(feedback.createdAt);
    return isValidDate(date) ? date.getTime() : Number.NEGATIVE_INFINITY;
  };

  return [...feedbacks].sort((a, b) => time(b) - time(a));
}

const EventFeedbackList = ({ feedbacks }: EventFeedbackListProps) => {
  const t = useTranslations('/events/eventid/feedback/list');
  const locale = useLocale();

  const items = sortNewestFirst(feedbacks);
  const showSender = items.some(feedback => !!feedback.user?.username);

  const formatCreatedAt = (value: string) => {
    const date = toDate(value);
    return isValidDate(date) ? new Intl.DateTimeFormat(toIntlLocale(locale), { dateStyle: 'medium', timeStyle: 'short' }).format(date) : '';
  };

  if (items.length === 0) {
    return <EmptyState icon={<IconMessageCircle stroke={1.75} aria-hidden />} title={t('textNoFeedback')} />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[1%] whitespace-nowrap">{t('tableColDate')}</TableHead>
          {showSender && <TableHead className="w-[1%] whitespace-nowrap">{t('tableColSender')}</TableHead>}
          <TableHead>{t('tableColMessage')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map(feedback => (
          <TableRow key={feedback.id}>
            <TableCell className="whitespace-nowrap align-top text-muted-foreground">{formatCreatedAt(feedback.createdAt)}</TableCell>
            {showSender && <TableCell className="whitespace-nowrap align-top font-medium">{feedback.user?.username}</TableCell>}
            <TableCell className="whitespace-pre-wrap break-words align-top">{feedback.message}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default EventFeedbackList;
