import { User } from '@/types/user';
import { EventRegistrationStatus } from '@/domain/enums/event-registration-status';
import UserCard from '../user/UserCard';

interface IUserSectionProps {
  sectionTitle: string;
  users: User[];
  showUserTypeImage?: boolean;
  registrationStatus?: EventRegistrationStatus[];
}

const UserSection = ({ sectionTitle, users, showUserTypeImage = false, registrationStatus }: IUserSectionProps) => {
  return (
    <div className={'rounded-lg border border-secondary-dark bg-secondary-light p-2 text-sm'}>
      <div className="text-base font-bold">{sectionTitle}</div>
      <div className="mt-1 flex flex-wrap gap-2">
        {users.map((user, i) => {
          return (
            <div key={i}>
              {registrationStatus && <UserCard user={user} showUserTypeImage={showUserTypeImage} registrationStatus={registrationStatus[i]} />}
              {!registrationStatus && <UserCard user={user} showUserTypeImage={showUserTypeImage} />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserSection;
