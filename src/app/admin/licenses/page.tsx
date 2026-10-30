import PageTitle from '@/components/page-title';
import { LicensesEditor } from './components/licenses-editor';

export default function LicenseAdministration() {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <PageTitle title="Manage Licenses" />
      <LicensesEditor />
    </div>
  );
}
