import { NotificationAction } from '../../../../domain/enums/notification-action';

export class CreateBroadcastBodyDto {
  title: string;
  message: string;
  action: NotificationAction;

  constructor(title: string, message: string, action: NotificationAction) {
    this.title = title;
    this.message = message;
    this.action = action;
  }
}
