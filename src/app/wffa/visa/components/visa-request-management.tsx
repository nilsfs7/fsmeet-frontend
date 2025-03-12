'use client';

import { useEffect, useState } from 'react';
import { Action } from '@/domain/enums/action';
import ActionButton from '@/components/common/ActionButton';
import LoadingSpinner from '@/components/animation/loading-spinner';
import { Toaster, toast } from 'sonner';
import { useSession } from 'next-auth/react';
import Separator from '@/components/Seperator';
import { getVisaInvitationRequests, updateVisaInvitationRequest } from '@/infrastructure/clients/event.client';
import { VisaInvitationRequest } from '@/types/visa-invitation-request';
import { VisaInvitationRequestApprovalState } from '@/domain/enums/visa-request-approval-state';

export const VisaRequestManagement = () => {
  const { data: session, status } = useSession();

  const [visaInvitationRequestsMap, setVisaInvitationRequests] = useState<VisaInvitationRequest[]>([]);

  const handleApproveClicked = async (req: VisaInvitationRequest) => {
    try {
      await updateVisaInvitationRequest(req.id, VisaInvitationRequestApprovalState.APPROVED, session);
      toast.success(`Visa request approved for ${req.firstName} ${req.lastName}.`);
    } catch (error: any) {
      toast.error(error.message);
      console.error(error.message);
    }
  };

  const handleDeniedClicked = async (req: VisaInvitationRequest) => {
    try {
      await updateVisaInvitationRequest(req.id, VisaInvitationRequestApprovalState.DENIED, session);
      toast.success(`Visa request denied for ${req.firstName} ${req.lastName}.`);
    } catch (error: any) {
      toast.error(error.message);
      console.error(error.message);
    }
  };

  useEffect(() => {
    getVisaInvitationRequests('0000', session).then(requests => {
      setVisaInvitationRequests(requests);
    });
  }, [visaInvitationRequestsMap === undefined, session]);

  if (!visaInvitationRequestsMap) {
    return <LoadingSpinner text="Loading..." />; // todo
  }

  return (
    <>
      <Toaster richColors />

      <div className="mx-2 overflow-y-auto">
        <div className={'rounded-lg border border-primary bg-secondary-light p-2 text-sm'}>
          <div className="flex flex-col">
            <div className="flex flex-col items-center mb-2">{`Pending`}</div>

            {visaInvitationRequestsMap.map((item, index) => {
              if (item.approvalState === VisaInvitationRequestApprovalState.PENDING)
                return (
                  <div key={index} className="m-1 flex items-center">
                    <div className="mx-1 flex w-1/2 justify-end gap-1">
                      <div className="flex-col flex">
                        {item.firstName} {item.lastName}
                      </div>

                      <div>{`(${item.id.substring(0, 3)}..${item.id.substring(item.id.length - 3)})`}</div>
                    </div>

                    <div className="mx-1 flex w-1/2 justify-start gap-1">
                      <>
                        <ActionButton
                          action={Action.ACCEPT}
                          onClick={() => {
                            handleApproveClicked(item);
                          }}
                        />

                        <ActionButton
                          action={Action.DENY}
                          onClick={() => {
                            handleDeniedClicked(item);
                          }}
                        />
                      </>
                    </div>
                  </div>
                );
            })}
            <div className="my-2">
              <Separator />
            </div>

            <div className="flex flex-col items-center mb-2">{`Approved`}</div>

            {visaInvitationRequestsMap.map((item, index) => {
              if (item.approvalState === VisaInvitationRequestApprovalState.APPROVED)
                return (
                  <div key={index} className="m-1 flex items-center">
                    <div className="mx-1 flex w-1/2 justify-end gap-1">
                      <div className="flex-col flex">
                        {item.firstName} {item.lastName}
                      </div>

                      <div>{`(${item.id.substring(0, 3)}..${item.id.substring(item.id.length - 3)})`}</div>
                    </div>

                    <div className="mx-1 flex w-1/2 justify-start gap-1">
                      <div className="flex items-center gap-2">
                        <a href={item.documentUrl} target="_blank" rel="noopener noreferrer">
                          <ActionButton action={Action.GOTOEXTERNAL} />
                        </a>

                        <div>{`Action: ${item.approver}`}</div>
                      </div>
                    </div>
                  </div>
                );
            })}

            <div className="my-2">
              <Separator />
            </div>

            <div className="flex flex-col items-center mb-2">{`Denied`}</div>

            {visaInvitationRequestsMap.map((item, index) => {
              if (item.approvalState === VisaInvitationRequestApprovalState.DENIED)
                return (
                  <div key={index} className="m-1 flex items-center">
                    <div className="mx-1 flex w-1/2 justify-end gap-1">
                      <div className="flex-col flex">
                        {item.firstName} {item.lastName}
                      </div>

                      <div>{`(${item.id.substring(0, 3)}..${item.id.substring(item.id.length - 3)})`}</div>
                    </div>

                    <div className="mx-1 flex w-1/2 justify-start gap-1">
                      <div className="flex items-center gap-2">
                        <ActionButton
                          action={Action.ACCEPT}
                          onClick={() => {
                            handleApproveClicked(item);
                          }}
                        />

                        <div>{`Action: ${item.approver}`}</div>
                      </div>
                    </div>
                  </div>
                );
            })}
          </div>
        </div>
      </div>
    </>
  );
};
