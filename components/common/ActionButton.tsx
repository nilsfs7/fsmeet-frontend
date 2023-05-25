import { Action } from '@/types/enums/action';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Save } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';

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
    case Action.DELETE:
      icon = <DeleteIcon />;
      break;
    case Action.EDIT:
      icon = <EditIcon />;
      break;
    case Action.SAVE:
      icon = <Save />;
      break;
  }

  return (
    <div className="rounded-lg border-[2px] border-black bg-zinc-300 font-bold text-black hover:bg-zinc-400" onClick={onClick}>
      <IconButton className="text-black hover:bg-transparent">{icon}</IconButton>
    </div>
  );
};

export default ActionButton;
