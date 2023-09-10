import { Action } from '@/types/enums/action';
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ArrowBackIcon from '@mui/icons-material/KeyboardBackspace';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckIcon from '@mui/icons-material/CheckCircle';
import CommentIcon from '@mui/icons-material/QuestionAnswerOutlined';
import CopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import TrophyIcon from '@mui/icons-material/EmojiEvents';
import EditIcon from '@mui/icons-material/Edit';
import PeopleIcon from '@mui/icons-material/PeopleAlt';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import SaveIcon from '@mui/icons-material/Save';
import SendIcon from '@mui/icons-material/Send';
import ShareIcon from '@mui/icons-material/Share';

interface IButton {
  action: Action;
  onClick?: () => void;
}

const ActionButton = ({ action, onClick }: IButton) => {
  const textColor = 'text-action-bg';

  let icon = <ArrowBackIcon className={`${textColor}`} />;

  switch (action) {
    case Action.ADD:
      icon = <AddCircleIcon className={`${textColor}`} />;
      break;
    case Action.ACCEPT:
      icon = <CheckIcon className={`${textColor}`} />;
      break;
    case Action.BACK:
      icon = <ArrowBackIcon className={`${textColor}`} />;
      break;
    case Action.CANCEL:
      icon = <CancelIcon className={`${textColor}`} />;
      break;
    case Action.COMMENT:
      icon = <CommentIcon className={`${textColor}`} />;
      break;
    case Action.COPY:
      icon = <CopyIcon className={`${textColor}`} />;
      break;
    case Action.DELETE:
      icon = <DeleteIcon className={`${textColor}`} />;
      break;
    case Action.DENY:
      icon = <CancelIcon className={`${textColor}`} />;
      break;
    case Action.EDIT:
      icon = <EditIcon className={`${textColor}`} />;
      break;
    case Action.MANAGE_COMPETITIONS:
      icon = <TrophyIcon className={`${textColor}`} />;
      break;
    case Action.MANAGE_USERS:
      icon = <PeopleIcon className={`${textColor}`} />;
      break;
    case Action.REMOVE:
      icon = <RemoveCircleIcon className={`${textColor}`} />;
      break;
    case Action.SAVE:
      icon = <SaveIcon className={`${textColor}`} />;
      break;
    case Action.SEND:
      icon = <SendIcon className={`${textColor}`} />;
      break;
    case Action.SHARE:
      icon = <ShareIcon className={`${textColor}`} />;
      break;
  }

  return (
    <div className="rounded-lg border border-black font-bold text-white" onClick={onClick}>
      <IconButton>{icon}</IconButton>
    </div>
  );
};

export default ActionButton;
