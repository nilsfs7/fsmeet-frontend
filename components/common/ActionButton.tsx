import { Action } from '@/types/enums/action';
import IconButton from '@mui/material/IconButton';
import CancelIcon from '@mui/icons-material/Cancel';
import CopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/KeyboardBackspace';
import EditIcon from '@mui/icons-material/Edit';
import PeopleIcon from '@mui/icons-material/PeopleAlt';
import SaveIcon from '@mui/icons-material/Save';
import ShareIcon from '@mui/icons-material/Share';

interface IButton {
  action: Action;
  onClick?: () => void;
}

const ActionButton = ({ action, onClick }: IButton) => {
  let icon = <ArrowBackIcon />;

  switch (action) {
    case Action.BACK:
      icon = <ArrowBackIcon />;
      break;
    case Action.CANCEL:
      icon = <CancelIcon />;
      break;
    case Action.COPY:
      icon = <CopyIcon />;
      break;
    case Action.DELETE:
      icon = <DeleteIcon />;
      break;
    case Action.EDIT:
      icon = <EditIcon />;
      break;
    case Action.MANAGE_USERS:
      icon = <PeopleIcon />;
      break;
    case Action.SAVE:
      icon = <SaveIcon />;
      break;
    case Action.SHARE:
      icon = <ShareIcon />;
      break;
  }

  return (
    <div className="rounded-lg border border-black bg-zinc-300 font-bold text-black hover:bg-zinc-400" onClick={onClick}>
      <IconButton className="text-black hover:bg-transparent">{icon}</IconButton>
    </div>
  );
};

export default ActionButton;
