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
      <div className="flex flex-wrap">
        {users.map((user, i) => {
          let margin = 'my-1 mx-1';
          i === 0 ? (margin = 'm-1') : null;
          i === users.length - 1 ? (margin = 'ml-1') : null;

          return (
            <div key={i} className={`my-1 ${margin}`}>
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
