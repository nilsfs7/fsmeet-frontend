import { Header } from '@/components/header';
import Navigation from '@/components/navigation';
import PageTitle from '@/components/page-title';
import ActionButton from '@/components/common/action-button';
import { routeAbout } from '@/domain/constants/routes';
import { Action } from '@/domain/enums/action';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import CryptoAddress from '@/components/crypto-address';
import { CryptoCurrencyCode } from '@/domain/enums/crypto-currency-code';

export default async function Donate() {
  const t = await getTranslations('/donate');

  return (
    <div className="h-[calc(100dvh)] flex flex-col">
      <Header />
      <PageTitle title={t('pageTitle')} />

      <div className="p-2 text-center">
        <p>{t('text1')}</p>
        <p>{t('text2')}</p>
      </div>

      <div className="p-2 flex flex-col gap-2 items-center overflow-y-auto">
        <CryptoAddress ticker={CryptoCurrencyCode.BTC} address={'bc1qe0yujtzhgjqkmnxuta0wtrpme53et9q3st083p'} />
        <CryptoAddress ticker={CryptoCurrencyCode.ETH} address={'0x3b6F25F4E16F2Dd7208961D60a2934FBc01e2799'} />
        <CryptoAddress ticker={CryptoCurrencyCode.SOL} address={'3TxQGtepnYypVYjfaDQHjSydfNnohTWJfMdGvCUMDT9i'} />
        <CryptoAddress ticker={CryptoCurrencyCode.SUI} address={'0x4a0102160013f246dea5bca066c454edf0fa0464bf8c5eee6262e2990f313ef9'} />
      </div>

      <Navigation>
        <Link href={routeAbout}>
          <ActionButton action={Action.BACK} />
        </Link>
      </Navigation>
    </div>
  );
}
