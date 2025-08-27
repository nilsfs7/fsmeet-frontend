import Navigation from '@/components/Navigation';
import ActionButton from '@/components/common/ActionButton';
import { routeAccount } from '@/domain/constants/routes';
import { Action } from '@/domain/enums/action';
import Link from 'next/link';
import { Header } from '@/components/Header';
import PageTitle from '@/components/PageTitle';
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
      amount: { amount: payment.amount, currency: payment.currency },
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
