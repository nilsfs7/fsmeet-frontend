import { UserActivity } from '@/domain/enums/user-activity';

export class CreateActivityBodyDto {
  userActivity: UserActivity;

  constructor(userActivity: UserActivity) {
    this.userActivity = userActivity;
  }
}
