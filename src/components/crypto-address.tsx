import { Action } from '@/domain/enums/action';
import ActionButton from './common/ActionButton';
import { CryptoCurrencyCode } from '@/domain/enums/crypto-currency-code';
import { ActionButtonCopyToClipboard } from '@/components/common/action-button-copy-to-clipboard';
import { truncateString } from '@/functions/string-manipulation';
import { getTranslations } from 'next-intl/server';
import { imgBitcoin, imgEthereum, imgSolana, imgSui } from '@/domain/constants/images';

interface ICryptoAddressProps {
  ticker: CryptoCurrencyCode;
  address: string;
}

const getLogo = (ticker: CryptoCurrencyCode): string => {
  switch (ticker) {
    case CryptoCurrencyCode.BTC:
      return imgBitcoin;
    case CryptoCurrencyCode.ETH:
      return imgEthereum;
    case CryptoCurrencyCode.SOL:
      return imgSolana;
    case CryptoCurrencyCode.SUI:
      return imgSui;

    default:
      return '';
  }
};

const getExplorerURL = (ticker: CryptoCurrencyCode, address: string): string => {
  switch (ticker) {
    case CryptoCurrencyCode.BTC:
      return `https://mempool.space/address/${address}`;
    case CryptoCurrencyCode.ETH:
      return `https://etherscan.io/address/${address}`;
    case CryptoCurrencyCode.SOL:
      return `https://solscan.io/account/${address}`;
    case CryptoCurrencyCode.SUI:
      return `https://suivision.xyz/account/${address}`;

    default:
      return '';
  }
};

const CryptoAddress = async ({ ticker, address }: ICryptoAddressProps) => {
  const t = await getTranslations('/donate');

  return (
    <div className="flex gap-2 items-center">
      <div className="w-16 grid grid-cols-2 gap-1 items-center">
        <img className="h-8 w-8 object-fill" src={getLogo(ticker)} />
        <div className="uppercase">{ticker}</div>
      </div>

      <div className="font-mono">{truncateString(address, 6, 6)}</div>

      <a href={getExplorerURL(ticker, address)} target="_blank" rel="noopener noreferrer">
        <ActionButton action={Action.GOTOEXTERNAL} tooltip={t('btnViewBlockExplorerToolTip')} />
      </a>

      <ActionButtonCopyToClipboard value={address} toastMessage={t('btnCopyAddress')} toolTipMessage={`${t('btnCopyAddressToolTip')} "${address}"`} />
    </div>
  );
};

export default CryptoAddress;
