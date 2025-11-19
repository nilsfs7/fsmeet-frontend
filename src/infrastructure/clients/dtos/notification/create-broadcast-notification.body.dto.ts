import { NotificationAction } from '../../../../domain/enums/notification-action';

export class CreateBroadcastBodyDto {
  title: string;
  message: string;
  action: NotificationAction;
  arbitraryData?: Record<string, string>;

  constructor(title: string, message: string, action: NotificationAction, arbitraryData?: Record<string, string>) {
    this.title = title;
    this.message = message;
    this.action = action;
    this.arbitraryData = arbitraryData;
  }
}
