import { VisaInvitationRequestApprovalState } from '@/domain/enums/visa-request-approval-state';

export class UpdateVisaInvitationRequestStateBodyDto {
  id: string;
  state: VisaInvitationRequestApprovalState;

  constructor(id: string, state: VisaInvitationRequestApprovalState) {
    this.id = id;
    this.state = state;
  }
}
