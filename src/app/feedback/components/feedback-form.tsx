'use client';

import { useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import type { Session } from 'next-auth';
import { Toaster, toast } from 'sonner';
import { IconSend } from '@tabler/icons-react';
import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Navigation from '@/components/navigation';
import ActionButton from '@/components/common/action-button';
import PageTitle from '@/components/page-title';
import { Action } from '@/domain/enums/action';
import { routeFeedback, routeFeedbackThankyou } from '@/domain/constants/routes';
import { cn } from '@/lib/utils';

interface FeedbackFormProps {
  title: string;
  description?: string;
  label: string;
  placeholder: string;
  submitText: string;
  icon: ReactNode;
  tone: string;
  submit: (message: string, session: Session | null) => Promise<unknown>;
}

/** Shared layout for the general / feature / bug feedback forms. */
export function FeedbackForm({ title, description, label, placeholder, submitText, icon, tone, submit }: FeedbackFormProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const canSubmit = message.trim().length > 0 && !submitting;

  const handleSubmitClicked = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await submit(message, session);
      router.push(routeFeedbackThankyou);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      toast.error(msg);
      console.error(msg);
      setSubmitting(false);
    }
  };

  return (
    <>
      <Toaster richColors />

      <div className="min-h-0 flex-1 flex flex-col">
        <PageTitle title={title} description={description} />

        <div className="flex min-h-0 flex-1 flex-col items-center overflow-y-auto px-4 pb-6 sm:px-6 md:px-8">
          <section className="flex w-full max-w-2xl min-w-0 flex-col gap-4 rounded-3xl border border-border bg-background p-5 shadow-xs sm:p-6">
            <div className="flex items-center gap-3">
              <span className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl [&>svg]:h-5 [&>svg]:w-5', tone)}>{icon}</span>
              <label htmlFor="feedback-message" className="text-base font-semibold text-foreground">
                {label}
              </label>
            </div>
            <Textarea
              id="feedback-message"
              placeholder={placeholder}
              value={message}
              rows={8}
              className="min-h-40 resize-y rounded-xl text-base sm:text-sm"
              onChange={e => setMessage(e.target.value)}
            />
            <div className="flex justify-end text-xs tabular-nums text-muted-foreground">{message.length}</div>
          </section>
        </div>

        <Navigation>
          <ActionButton href={routeFeedback} action={Action.BACK} />

          <Button type="button" variant="action" className={ctaActionButtonClassName} onClick={handleSubmitClicked} disabled={!canSubmit}>
            <IconSend className="h-4 w-4" stroke={2} aria-hidden />
            {submitText}
          </Button>
        </Navigation>
      </div>
    </>
  );
}
