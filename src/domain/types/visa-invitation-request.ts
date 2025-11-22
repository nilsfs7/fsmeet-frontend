import { VisaInvitationRequestApprovalState } from '@/domain/enums/visa-request-approval-state';

export type VisaInvitationRequest = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  countryCode: string;
  passportNumber: string;
  approvalState: VisaInvitationRequestApprovalState;
  approver: string;
  documentUrl: string;
};
