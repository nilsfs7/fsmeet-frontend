import { Header } from '@/components/header';
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

export default async function Donate() {
  const t = await getTranslations('/donate');

  return (
    <div className="min-h-0 flex-1 flex flex-col">
      <Header />
      <PageTitle title={t('pageTitle')} />

      <PageInset variant="default" className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto">
        <div className="flex w-full min-w-0 flex-col items-center gap-4 sm:gap-6">
          <div className="w-full text-balance text-center">
            <p className="type-body-sm text-foreground/90">{t('text1')}</p>
            <p className="type-body-sm mt-2 text-foreground/90">{t('text2')}</p>
          </div>

          <div className="flex w-full min-w-0 max-w-form flex-col items-stretch gap-2">
            <p className="type-body-sm text-center italic text-muted-foreground">{t('textUseCard')}</p>
            <DonationForm />
          </div>

          <div className="flex w-full min-w-0 max-w-2xl flex-col gap-2 sm:gap-3">
            <p className="type-body-sm text-center italic text-muted-foreground">{t('textUseCrypto')}</p>
            <div className="flex flex-col items-center gap-2">
              <CryptoAddress ticker={CryptoCurrencyCode.BTC} address={'bc1qe0yujtzhgjqkmnxuta0wtrpme53et9q3st083p'} />
              <CryptoAddress ticker={CryptoCurrencyCode.ETH} address={'0x3b6F25F4E16F2Dd7208961D60a2934FBc01e2799'} />
              <CryptoAddress ticker={CryptoCurrencyCode.SOL} address={'3TxQGtepnYypVYjfaDQHjSydfNnohTWJfMdGvCUMDT9i'} />
              <CryptoAddress ticker={CryptoCurrencyCode.SUI} address={'0x4a0102160013f246dea5bca066c454edf0fa0464bf8c5eee6262e2990f313ef9'} />
            </div>
          </div>
        </div>
      </PageInset>

      <Navigation>
        <ActionButton href={routeAbout} action={Action.BACK} />
      </Navigation>
    </div>
  );
}
