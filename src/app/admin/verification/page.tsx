import PageTitle from '@/components/page-title';
import { VerificationEditor } from './components/verification-editor';

export default function UserVerification() {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <PageTitle title="User Verification" />
      <VerificationEditor />
    </div>
  );
}
