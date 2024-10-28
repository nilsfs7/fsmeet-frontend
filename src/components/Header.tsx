import LanguagePicker from './LanguagePicker';
import { LogoFSMeet } from './Logo';
import ProfileMenu from './user/ProfileMenu';

interface IHeaderProps {
  showMenu?: boolean;
}

export const Header = ({ showMenu = false }: IHeaderProps) => {
  return (
    <div className="bg-secondary-light sm:block">
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
