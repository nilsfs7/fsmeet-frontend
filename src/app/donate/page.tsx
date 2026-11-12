import { IconCreditCard, IconCurrencyBitcoin, IconHeart } from '@tabler/icons-react';
import Navigation from '@/components/navigation';
import PageTitle from '@/components/page-title';
import ActionButton from '@/components/common/action-button';
import { routeAbout } from '@/domain/constants/routes';
import { Action } from '@/domain/enums/action';
import { getTranslations } from 'next-intl/server';
import CryptoAddress from '@/components/crypto-address';
import { CryptoCurrencyCode } from '@/domain/enums/crypto-currency-code';
import DonationForm from './components/donation-form';
import { PageInset } from '@/components/layout/page-inset';

/** The copy is written as a flowing sentence ("Donate by card..." / "...or use crypto."); trim the ellipses for use as card headings. */
function asHeading(text: string): string {
  const trimmed = text.replace(/^[.…\s]+|[.…\s]+$/g, '');
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

export default async function Donate() {
  const t = await getTranslations('/donate');

  return (
    <div className="min-h-0 flex-1 flex flex-col">
      <PageTitle title={t('pageTitle')} />

      <PageInset variant="default" className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto">
        <div className="mx-auto flex w-full min-w-0 max-w-4xl flex-col gap-5 pb-6">
          <div className="flex flex-col items-center gap-3 text-balance text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand-strong">
              <IconHeart className="h-6 w-6" stroke={1.75} aria-hidden />
            </span>
            <p className="max-w-2xl text-foreground/90">{t('text1')}</p>
            <p className="max-w-2xl text-muted-foreground">{t('text2')}</p>
          </div>

          <div className="grid min-w-0 gap-4 md:grid-cols-2">
            <section className="flex min-w-0 flex-col gap-4 rounded-3xl border border-border bg-background p-5 shadow-xs sm:p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300">
                  <IconCreditCard className="h-5 w-5" stroke={1.75} aria-hidden />
                </span>
                <h2 className="text-base font-semibold text-foreground">{asHeading(t('textUseCard'))}</h2>
              </div>
              <DonationForm />
            </section>

            <section className="flex min-w-0 flex-col gap-4 rounded-3xl border border-border bg-background p-5 shadow-xs sm:p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
                  <IconCurrencyBitcoin className="h-5 w-5" stroke={1.75} aria-hidden />
                </span>
                <h2 className="text-base font-semibold text-foreground">{asHeading(t('textUseCrypto'))}</h2>
              </div>
              <div className="flex min-w-0 flex-col gap-2">
                <CryptoAddress ticker={CryptoCurrencyCode.BTC} address={'bc1qe0yujtzhgjqkmnxuta0wtrpme53et9q3st083p'} />
                <CryptoAddress ticker={CryptoCurrencyCode.ETH} address={'0x3b6F25F4E16F2Dd7208961D60a2934FBc01e2799'} />
                <CryptoAddress ticker={CryptoCurrencyCode.SOL} address={'3TxQGtepnYypVYjfaDQHjSydfNnohTWJfMdGvCUMDT9i'} />
              </div>
            </section>
          </div>
        </div>
      </PageInset>

      <Navigation>
        <ActionButton href={routeAbout} action={Action.BACK} />
      </Navigation>
    </div>
  );
}
