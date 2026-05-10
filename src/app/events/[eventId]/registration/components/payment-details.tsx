'use client';

import { EventRegistrationType } from '@/domain/types/event-registration-type';
import { Event } from '@/domain/types/event';
import { isCompetition } from '@/functions/is-competition';
import { convertCurrencyIntegerToDecimal } from '@/functions/currency-conversion';
import { getCurrencySymbol } from '@/functions/get-currency-symbol';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { useMemo, useState, type ComponentProps, type ReactNode } from 'react';
import { Competition } from '@/domain/types/competition';
import { useTranslations } from 'next-intl';
import { ChevronDown } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Accordion, AccordionContent, AccordionItem } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { registrationListScrollClass, registrationListShellClass } from './registration-list-layout';

interface IPaymentDetails {
  event: Event;
  competitions: Competition[];
  registrationType: EventRegistrationType;
  compSignUps: string[];
  accommodationOrders: string[];
  offeringOrders: string[];
  paymentFeeCover: boolean;
  onDonationCheckedChange: (donationAmount: number) => void;
}

const rowHoverClass = 'hover:bg-muted/25 dark:hover:bg-muted/20';

/** Same width for every row’s amount column; third column = chevrons or empty for alignment. */
const ROW_GRID = 'grid w-full min-w-0 grid-cols-[minmax(0,1fr)_6.5rem_1.25rem] items-center gap-x-2 pl-3 pr-2 sm:pl-3 sm:pr-3';
const priceColClass = 'w-full min-w-0 text-right text-sm tabular-nums text-foreground';

function PaymentTrailSpacer() {
  return <div className="h-4 w-[1.25rem] min-w-[1.25rem] shrink-0" aria-hidden="true" />;
}

function AccordionRowTrigger({ children, className, ...rest }: { children: ReactNode; className?: string } & ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Trigger
      className={cn(
        'group',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 data-[state=open]:text-foreground',
        'py-2.5 text-left text-sm font-normal',
        'hover:no-underline',
        ROW_GRID,
        className,
      )}
      {...rest}
    >
      {children}
    </AccordionPrimitive.Trigger>
  );
}

export const PaymentDetails = ({ event, competitions, registrationType, compSignUps, accommodationOrders, offeringOrders, paymentFeeCover, onDonationCheckedChange }: IPaymentDetails) => {
  const t = useTranslations('global/components/payment-details');
  const tTable = useTranslations('global/components/offering-list');

  let eventFee = registrationType === EventRegistrationType.PARTICIPANT ? event.participationFee : event.visitorFee;
  if (paymentFeeCover) {
    eventFee = registrationType === EventRegistrationType.PARTICIPANT ? event.participationFeeIncPaymentCosts : event.visitorFeeIncPaymentCosts;
  }

  const [donationChecked, setDonationChecked] = useState<boolean>(false);

  const formatMoney = (amountMinor: number) => `${convertCurrencyIntegerToDecimal(amountMinor, event.currency).toFixed(2).replace('.', ',')} ${getCurrencySymbol(event.currency)}`;

  const getTotal = (): number => {
    return (
      eventFee +
      competitions.filter(c => c.id && compSignUps.includes(c.id)).reduce((acc, c) => acc + (paymentFeeCover ? c.participationFeeIncPaymentCosts : c.participationFee), 0) +
      event.accommodations.filter(a => a.id && accommodationOrders.includes(a.id)).reduce((acc, a) => acc + (paymentFeeCover ? a.costIncPaymentCosts : a.cost), 0) +
      event.offerings.filter(o => o.id && offeringOrders.includes(o.id)).reduce((off, o) => off + (paymentFeeCover ? o.costIncPaymentCosts : o.cost), 0)
    );
  };

  const getDonationAmount = (): number => {
    return Math.round(getTotal() * 0.01); // 1% of total sum
  };

  const selectedCompetitions = useMemo(() => competitions.filter(c => c.id && compSignUps.includes(c.id)), [competitions, compSignUps]);

  const selectedOfferings = useMemo(() => event.offerings.filter(o => o.id && offeringOrders.includes(o.id)), [event.offerings, offeringOrders]);

  const selectedAccommodations = useMemo(() => event.accommodations.filter(a => a.id && accommodationOrders.includes(a.id)), [event.accommodations, accommodationOrders]);

  const compFeeSum = selectedCompetitions.reduce((acc, c) => acc + (paymentFeeCover ? c.participationFeeIncPaymentCosts : c.participationFee), 0);

  const offeringsFeeSum = selectedOfferings.reduce((off, o) => off + (paymentFeeCover ? o.costIncPaymentCosts : o.cost), 0);

  const accommodationsFeeSum = selectedAccommodations.reduce((acc, a) => acc + (paymentFeeCover ? a.costIncPaymentCosts : a.cost), 0);

  const showCompetitionsAccordion = registrationType === EventRegistrationType.PARTICIPANT && isCompetition(event.type) && selectedCompetitions.length > 0;
  const showOfferingsAccordion = selectedOfferings.length > 0;
  const showAccommodationsAccordion = selectedAccommodations.length > 0;

  const showDonationRow = event.paymentMethodStripe.enabled && getTotal() > 0;

  const compFee = (c: Competition) => (paymentFeeCover ? c.participationFeeIncPaymentCosts : c.participationFee);

  return (
    <div className="min-w-0">
      <div className={registrationListShellClass}>
        <div className={registrationListScrollClass}>
          <div className="w-full min-w-0 text-sm text-foreground">
            <div className="bg-muted/80 text-foreground/90">
              <div
                className={cn(
                  ROW_GRID,
                  'text-left text-xs font-medium uppercase leading-normal tracking-wide sm:py-0',
                )}
              >
                <div className="min-w-0 py-2.5 pr-1 sm:pr-2 sm:py-3 sm:pl-0">{tTable('columnTitleDescription')}</div>
                <div className="whitespace-nowrap py-2.5 pl-0 text-right sm:py-3">{tTable('columnTitleCost')}</div>
                <div className="h-4 w-[1.25rem] min-w-[1.25rem] shrink-0" aria-hidden="true" />
              </div>
            </div>

            <div
              className={cn(
                ROW_GRID,
                'border-b border-border/50 py-2.5 sm:py-3',
                rowHoverClass,
              )}
            >
              <div className="min-w-0 break-words pr-1 sm:pr-2">{t('feeEvent')}</div>
              <div className={priceColClass}>{formatMoney(eventFee)}</div>
              <PaymentTrailSpacer />
            </div>

            <Accordion type="multiple" defaultValue={[]} className="w-full">
              {showCompetitionsAccordion && (
                <AccordionItem value="competitions" className="border-b border-border/50">
                  <AccordionPrimitive.Header className="m-0 flex w-full p-0">
                    <AccordionRowTrigger className={rowHoverClass}>
                      <div className="min-w-0 pr-1 font-normal sm:pr-2">{t('feeCompetitions')}</div>
                      <div className={priceColClass}>{formatMoney(compFeeSum)}</div>
                      <ChevronDown
                        className="h-4 w-4 shrink-0 text-foreground/80 transition-transform duration-200 group-data-[state=open]:rotate-180"
                        aria-hidden="true"
                      />
                    </AccordionRowTrigger>
                  </AccordionPrimitive.Header>
                  <AccordionContent className="pb-0 pt-0">
                    <div className="border-t border-border/40 bg-muted/15 dark:bg-muted/10">
                      {selectedCompetitions.map(c => (
                        <div
                          key={c.id ?? c.name}
                          className={cn(ROW_GRID, 'border-b border-border/40 py-2 pl-6 last:border-b-0 sm:pl-8', rowHoverClass)}
                        >
                          <div className="min-w-0 break-words pr-1 sm:pr-2">{c.name}</div>
                          <div className={priceColClass}>{formatMoney(compFee(c))}</div>
                          <PaymentTrailSpacer />
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {showOfferingsAccordion && (
                <AccordionItem value="offerings" className="border-b border-border/50">
                  <AccordionPrimitive.Header className="m-0 flex w-full p-0">
                    <AccordionRowTrigger className={rowHoverClass}>
                      <div className="min-w-0 pr-1 font-normal sm:pr-2">{t('feeOfferings')}</div>
                      <div className={priceColClass}>{formatMoney(offeringsFeeSum)}</div>
                      <ChevronDown
                        className="h-4 w-4 shrink-0 text-foreground/80 transition-transform duration-200 group-data-[state=open]:rotate-180"
                        aria-hidden="true"
                      />
                    </AccordionRowTrigger>
                  </AccordionPrimitive.Header>
                  <AccordionContent className="pb-0 pt-0">
                    <div className="border-t border-border/40 bg-muted/15 dark:bg-muted/10">
                      {selectedOfferings.map((o, index) => (
                        <div
                          key={o.id ?? `offering-${index}`}
                          className={cn(ROW_GRID, 'border-b border-border/40 py-2 pl-6 last:border-b-0 sm:pl-8', rowHoverClass)}
                        >
                          <div className="min-w-0 break-words pr-1 sm:pr-2">{o.description}</div>
                          <div className={priceColClass}>{formatMoney(paymentFeeCover ? o.costIncPaymentCosts : o.cost)}</div>
                          <PaymentTrailSpacer />
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {showAccommodationsAccordion && (
                <AccordionItem value="accommodations" className="border-b border-border/50">
                  <AccordionPrimitive.Header className="m-0 flex w-full p-0">
                    <AccordionRowTrigger className={rowHoverClass}>
                      <div className="min-w-0 pr-1 font-normal sm:pr-2">{t('feeAccommodations')}</div>
                      <div className={priceColClass}>{formatMoney(accommodationsFeeSum)}</div>
                      <ChevronDown
                        className="h-4 w-4 shrink-0 text-foreground/80 transition-transform duration-200 group-data-[state=open]:rotate-180"
                        aria-hidden="true"
                      />
                    </AccordionRowTrigger>
                  </AccordionPrimitive.Header>
                  <AccordionContent className="pb-0 pt-0">
                    <div className="border-t border-border/40 bg-muted/15 dark:bg-muted/10">
                      {selectedAccommodations.map((a, index) => (
                        <div
                          key={a.id ?? `accommodation-${index}`}
                          className={cn(ROW_GRID, 'border-b border-border/40 py-2 pl-6 last:border-b-0 sm:pl-8', rowHoverClass)}
                        >
                          <div className="min-w-0 break-words pr-1 sm:pr-2">{a.description}</div>
                          <div className={priceColClass}>{formatMoney(paymentFeeCover ? a.costIncPaymentCosts : a.cost)}</div>
                          <PaymentTrailSpacer />
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>

            {showDonationRow && (
              <div
                className={cn(ROW_GRID, 'border-b border-border/50 py-2.5 sm:py-3', rowHoverClass)}
              >
                <div className="flex min-w-0 items-center gap-2 pr-1 sm:pr-2">
                  <span className="break-words">{t('chbDonation')}</span>
                  <Checkbox
                    id="input-donation"
                    checked={donationChecked}
                    onCheckedChange={v => {
                      const on = v === true;
                      setDonationChecked(on);
                      onDonationCheckedChange(on ? getDonationAmount() : 0);
                    }}
                    className="shrink-0"
                  />
                </div>
                <div className={priceColClass}>{donationChecked ? formatMoney(getDonationAmount()) : ''}</div>
                <PaymentTrailSpacer />
              </div>
            )}

            <div
              className={cn(
                ROW_GRID,
                'border-t border-border/60 bg-muted/30 py-2.5 font-semibold sm:py-3',
                'text-foreground dark:bg-muted/25',
              )}
            >
              <div className="min-w-0 break-words pr-1 sm:pr-2">{t('feeTotal')}</div>
              <div className={priceColClass}>{formatMoney(donationChecked ? getTotal() + getDonationAmount() : getTotal())}</div>
              <PaymentTrailSpacer />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
