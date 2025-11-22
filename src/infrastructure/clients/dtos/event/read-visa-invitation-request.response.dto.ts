import { VisaInvitationRequestApprovalState } from '@/domain/enums/visa-request-approval-state';

export class ReadVisaInvitationRequestResponseDto {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  countryCode: string;
  passportNumber: string;
  approvalState: VisaInvitationRequestApprovalState;
  approver: string;
  documentUrl: string;

  constructor(
    id: string,
    username: string,
    firstName: string,
    lastName: string,
    countryCode: string,
    passportNumber: string,
    approvalState: VisaInvitationRequestApprovalState,
    approver: string,
    documentUrl: string
  ) {
    this.id = id;
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
    this.countryCode = countryCode;
    this.passportNumber = passportNumber;
    this.approvalState = approvalState;
    this.approver = approver;
    this.documentUrl = documentUrl;
  }
}
