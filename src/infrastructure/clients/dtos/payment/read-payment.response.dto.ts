import { Moment } from 'moment';
import { CurrencyCode } from '../../../../domain/enums/currency-code';
import { PaymentProduct } from '../../../../domain/enums/payment-product';

export class ReadPaymentResponseDto {
  intentId: string;
  amount: number;
  appFeeAmount: number;
  donationAmount: number;
  amountRefunded: number;
  currency: CurrencyCode;
  status: string;
  refPaymentProduct: PaymentProduct;
  refProduct: string;
  refUsername: string;
  date: Moment;

  constructor(
    intentId: string,
    amount: number,
    appFeeAmount: number,
    donationAmount: number,
    amountRefunded: number,
    currency: CurrencyCode,
    status: string,
    refPaymentProduct: PaymentProduct,
    refProduct: string,
    refUsername: string,
    date: Moment
  ) {
    this.intentId = intentId;
    this.amount = amount;
    this.appFeeAmount = appFeeAmount;
    this.donationAmount = donationAmount;
    this.amountRefunded = amountRefunded;
    this.currency = currency;
    this.status = status;
    this.refPaymentProduct = refPaymentProduct;
    this.refProduct = refProduct;
    this.refUsername = refUsername;
    this.date = date;
  }
}
