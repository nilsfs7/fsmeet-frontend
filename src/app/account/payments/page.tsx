import Navigation from '@/components/navigation';
import ActionButton from '@/components/common/action-button';
import { routeAccount } from '@/domain/constants/routes';
import { Action } from '@/domain/enums/action';
import { Header } from '@/components/header';
import PageTitle from '@/components/page-title';
import { ColumnInfo, PaymentsList } from './components/payments-list';
import { getTranslations } from 'next-intl/server';
import { getPayments } from '../../../infrastructure/clients/payment.client';
import { auth } from '../../../auth';
import { cn } from '@/lib/utils';
import { appShellContentClass } from '@/components/layout/app-shell-content';

const constrainedContentClass = cn(appShellContentClass, 'max-w-content');

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
    <div className="min-h-0 flex-1 flex flex-col">
      <Header />

      <div className={constrainedContentClass}>
        <PageTitle title={t('pageTitle')} />
      </div>

      <div className={cn('mt-2 flex min-h-0 flex-1 min-w-0 flex-col overflow-hidden', constrainedContentClass)}>
        <PaymentsList columnData={columnData} />
      </div>

      <Navigation>
        <ActionButton href={`${routeAccount}/?tab=account`} action={Action.BACK} />
      </Navigation>
    </div>
  );
}
