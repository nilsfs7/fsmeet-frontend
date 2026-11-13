import { User } from '@/domain/types/user';
import { EventRegistrationStatus } from '@/domain/enums/event-registration-status';
import UserCard from '../user/user-card';

interface IUserSectionProps {
  sectionTitle: string;
  users: User[];
  showUserCountryFlag?: boolean;
  registrationStatus?: EventRegistrationStatus[];
}

const UserSection = ({ sectionTitle, users, showUserCountryFlag = false, registrationStatus }: IUserSectionProps) => {
  return (
    <div className="rounded-2xl border border-border bg-background p-4 text-sm shadow-xs sm:p-6">
      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{sectionTitle}</div>
      <div className="mt-3 flex flex-wrap gap-2">
        {users.map((user, i) => {
          return (
            <div key={i}>
              {registrationStatus && <UserCard user={user} showUserCountryFlag={showUserCountryFlag} registrationStatus={registrationStatus[i]} />}
              {!registrationStatus && <UserCard user={user} showUserCountryFlag={showUserCountryFlag} />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserSection;
