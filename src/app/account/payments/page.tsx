import Navigation from '@/components/navigation';
import ActionButton from '@/components/common/action-button';
import { routeAccount } from '@/domain/constants/routes';
import { Action } from '@/domain/enums/action';
import Link from 'next/link';
import { Header } from '@/components/header';
import PageTitle from '@/components/page-title';
import { ColumnInfo, PaymentsList } from './components/payments-list';
import { getTranslations } from 'next-intl/server';
import { getPayments } from '../../../infrastructure/clients/payment.client';
import { auth } from '../../../auth';

export default async function Payments() {
  const t = await getTranslations('/account/payments');

  const session = await auth();
  const payments = await getPayments(session);

  const columnData: ColumnInfo[] = [];
  payments.forEach(payment => {
    columnData.push({
      intentId: payment.intentId,
      username: payment.refUsername,
      amount: { amount: payment.amount, currency: payment.currency, amountRefunded: payment.amountRefunded },
      date: payment.date,
    });
  });

  return (
    <div className="h-[calc(100dvh)] flex flex-col">
      <Header />

      <PageTitle title={t('pageTitle')} />

      <PaymentsList columnData={columnData} />

      <Navigation>
        <Link href={`${routeAccount}/?tab=account`}>
          <ActionButton action={Action.BACK} />
        </Link>
      </Navigation>
    </div>
  );
}
