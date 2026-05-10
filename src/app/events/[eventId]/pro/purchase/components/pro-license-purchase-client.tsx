'use client';

import { type ReactNode, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { toast, Toaster } from 'sonner';
import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import { routeEvents } from '@/domain/constants/routes';
import { createEventLicenseCheckout } from '@/infrastructure/clients/event.client';
import CheckoutForm from '@/components/stripe-checkout';
import { cn } from '@/lib/utils';
import type { ReadStripeCheckoutResponseDto } from '@/infrastructure/clients/dtos/event/read-stripe-checkout.response.dto';

const FIELD_ROW_CLASS = 'grid min-w-0 grid-cols-[minmax(0,1fr),minmax(0,1.5fr)] items-center gap-x-3 gap-y-1';
const FIELD_LABEL_CLASS = 'min-w-0 text-sm font-medium leading-none';
const FIELD_CONTROL_CLASS = 'min-w-0 w-full';
const READONLY_VALUE_CLASS = 'min-w-0 text-sm text-foreground/90';

const overviewPanelClass = cn(
  'flex w-full max-w-2xl min-w-0 flex-col overflow-y-auto scrollbar-none',
  'gap-3 self-center rounded-xl border border-border/60 bg-secondary-light/85 p-2.5',
  'shadow-xs backdrop-blur-sm supports-[backdrop-filter]:bg-secondary-light/70',
  'dark:border-border/50 dark:bg-background/60 dark:supports-[backdrop-filter]:bg-background/50',
);

function FieldRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={FIELD_ROW_CLASS}>
      <div className={FIELD_LABEL_CLASS}>{label}</div>
      <div className={FIELD_CONTROL_CLASS}>{children}</div>
    </div>
  );
}

function resolveClientSecret(dto: ReadStripeCheckoutResponseDto): string | null {
  return dto.clientSecret || dto.piClientSecret || null;
}

export function ProLicensePurchaseClient({ eventId, eventName, formattedLicensePrice }: { eventId: string; eventName: string; formattedLicensePrice: string }) {
  const t = useTranslations('/events/eventid/pro/purchase');
  const tReg = useTranslations('/events/eventid/registration');
  const { data: session } = useSession();

  const [checkout, setCheckout] = useState<ReadStripeCheckoutResponseDto | null>(null);
  const [loading, setLoading] = useState(false);

  const successUrl = typeof window !== 'undefined' ? `${window.location.origin}${routeEvents}/${eventId}/pro/purchase/success` : '';

  const handleStartCheckout = async () => {
    if (!session) {
      toast.error(t('errorSignIn'));
      return;
    }
    setLoading(true);
    try {
      const dto = await createEventLicenseCheckout(eventId, successUrl, session);
      if (dto.checkoutUrl) {
        window.location.href = dto.checkoutUrl;
        return;
      }
      const secret = resolveClientSecret(dto);
      if (!secret) {
        throw new Error(t('errorMissingSecret'));
      }
      setCheckout(dto);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : t('errorCheckout'));
    } finally {
      setLoading(false);
    }
  };

  const secret = checkout ? resolveClientSecret(checkout) : null;

  return (
    <div className="flex flex-col gap-4 pb-4">
      <Toaster richColors />

      <div className={overviewPanelClass}>
        <FieldRow label={`${tReg('pageOverviewEvent')}:`}>
          <div className={READONLY_VALUE_CLASS}>{eventName}</div>
        </FieldRow>
        <FieldRow label={`${t('pageOverviewProduct')}:`}>
          <div className={READONLY_VALUE_CLASS}>{t('pageOverviewProductHint')}</div>
        </FieldRow>
        {formattedLicensePrice != null && formattedLicensePrice !== '' && (
          <FieldRow label={`${t('pageOverviewPrice')}:`}>
            <div className={READONLY_VALUE_CLASS}>{formattedLicensePrice}</div>
          </FieldRow>
        )}
      </div>

      {!checkout && (
        <div className="flex justify-center">
          <Button type="button" variant="action" className={ctaActionButtonClassName} disabled={loading} onClick={handleStartCheckout}>
            {loading ? t('btnWorking') : t('btnCheckout')}
          </Button>
        </div>
      )}

      {secret && (
        <div className="mx-auto w-full max-w-2xl rounded-xl border border-border/60 bg-background p-4">
          <CheckoutForm clientSecret={secret} stripeAccount={checkout?.stripeAccountId || undefined} confirmPaymentBtnText={t('btnPay')} returnUrl={successUrl} />
        </div>
      )}
    </div>
  );
}
