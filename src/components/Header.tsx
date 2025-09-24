import LanguagePicker from './language-picker';
import { LogoFSMeet } from './Logo';
import ProfileMenu from './user/profile-menu';

interface IHeaderProps {
  showMenu?: boolean;
}

export const Header = ({ showMenu = false }: IHeaderProps) => {
  return (
    <div className="bg-secondary-light sm:block z-50">
      <div className="mx-2 flex h-20 items-center justify-between">
        <LogoFSMeet />

        <div className="flex gap-2">
          {showMenu && <ProfileMenu />}
          <LanguagePicker />
        </div>
      </div>
    </div>
  );
};
