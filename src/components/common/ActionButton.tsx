import { Action } from '@/types/enums/action';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ArrowBackIcon from '@mui/icons-material/KeyboardBackspace';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckIcon from '@mui/icons-material/CheckCircle';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CommentIcon from '@mui/icons-material/QuestionAnswerOutlined';
import CopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PaidIcon from '@mui/icons-material/Paid';
import PeopleIcon from '@mui/icons-material/PeopleAlt';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import SaveIcon from '@mui/icons-material/Save';
import SendIcon from '@mui/icons-material/Send';
import ShareIcon from '@mui/icons-material/Share';
import TrophyIcon from '@mui/icons-material/EmojiEvents';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Size } from '@/types/enums/size';
import { imgWorld } from '@/types/consts/images';

interface IButton {
  action: Action;
  size?: Size;
  onClick?: () => void;
}

enum IconSize {
  S = 'h-4 w-4',
  M = 'h-6 w-6',
  L = 'h-8 w-8',
}

enum ButtonSize {
  S = 'h-8 w-8',
  M = 'h-10 w-10',
  L = 'h-12 w-12',
}

const ActionButton = ({ action, size = Size.M, onClick }: IButton) => {
  const textColor = 'text-primary';

  let buttonSize = '';
  let iconSize = '';
  switch (size) {
    case Size.S:
      buttonSize = ButtonSize.S;
      iconSize = IconSize.S;
      break;
    case Size.M:
      buttonSize = ButtonSize.M;
      iconSize = IconSize.M;
      break;
    case Size.L:
      buttonSize = ButtonSize.L;
      iconSize = IconSize.L;
      break;
  }

  const className = `${textColor} ${iconSize}`;

  let icon = <ArrowBackIcon className={`${className}`} />;

  switch (action) {
    case Action.ADD:
      icon = <AddCircleIcon className={className} />;
      break;
    case Action.ACCEPT:
      icon = <CheckIcon className={className} />;
      break;
    case Action.BACK:
      icon = <ArrowBackIcon className={className} />;
      break;
    case Action.CANCEL:
      icon = <CancelIcon className={className} />;
      break;
    case Action.COMMENT:
      icon = <CommentIcon className={className} />;
      break;
    case Action.COPY:
      icon = <CopyIcon className={className} />;
      break;
    case Action.DELETE:
      icon = <DeleteIcon className={className} />;
      break;
    case Action.DENY:
      icon = <CancelIcon className={className} />;
      break;
    case Action.DOWNLOAD:
      icon = <CloudDownloadIcon className={className} />;
      break;
    case Action.EDIT:
      icon = <EditIcon className={className} />;
      break;
    case Action.HIDE:
      icon = <VisibilityOffIcon className={className} />;
      break;
    case Action.MANAGE_COMPETITIONS:
      icon = <TrophyIcon className={className} />;
      break;
    case Action.MANAGE_USERS:
      icon = <PeopleIcon className={className} />;
      break;
    case Action.MANAGE_SPONSORS:
      icon = <PaidIcon className={className} />;
      break;
    case Action.REMOVE:
      icon = <RemoveCircleIcon className={className} />;
      break;
    case Action.SAVE:
      icon = <SaveIcon className={className} />;
      break;
    case Action.SEND:
      icon = <SendIcon className={className} />;
      break;
    case Action.SHARE:
      icon = <ShareIcon className={className} />;
      break;
    case Action.SHOW:
      icon = <VisibilityIcon className={className} />;
      break;
    case Action.GOTOMAP:
      icon = <img src={imgWorld} className={className} />;
      break;
  }

  return (
    <div className={`rounded-lg border border-primary ${buttonSize} flex justify-center items-center hover:bg-secondary`} onClick={onClick}>
      {icon}
    </div>
  );
};

export default ActionButton;
