import PageTitle from '@/components/page-title';
import { JobProfileStateEditor } from './components/job-profile-state-editor';

export default function JobProfiles() {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <PageTitle title="Job Profiles" />
      <JobProfileStateEditor />
    </div>
  );
}
