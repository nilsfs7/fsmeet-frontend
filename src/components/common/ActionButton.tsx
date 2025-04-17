import { Action } from '@/domain/enums/action';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ArrowBackIcon from '@mui/icons-material/KeyboardBackspace';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckIcon from '@mui/icons-material/CheckCircle';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CommentIcon from '@mui/icons-material/QuestionAnswerOutlined';
import CopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import HotelIcon from '@mui/icons-material/Hotel';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PaidIcon from '@mui/icons-material/Paid';
import PeopleIcon from '@mui/icons-material/PeopleAlt';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import SaveIcon from '@mui/icons-material/Save';
import SendIcon from '@mui/icons-material/Send';
import ShareIcon from '@mui/icons-material/Share';
import TrophyIcon from '@mui/icons-material/EmojiEvents';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Size } from '@/domain/enums/size';
import { imgWorld } from '@/domain/constants/images';
import { ButtonStyle } from '@/domain/enums/button-style';

interface IButton {
  action: Action;
  size?: Size;
  style?: ButtonStyle;
  onClick?: () => void;
}

enum ButtonSize {
  S = 'h-8 w-8',
  M = 'h-10 w-10',
}

const ActionButton = ({ action, size = Size.M, style = ButtonStyle.DEFAULT, onClick }: IButton) => {
  const getButtonColors = () => {
    switch (style) {
      case ButtonStyle.DEFAULT:
        return 'bg-transparent hover:bg-secondary-light text-primary border-primary';
      case ButtonStyle.WARNING:
        return 'bg-transparent hover:bg-secondary-light text-warning border-primary';
      case ButtonStyle.CRITICAL:
        return 'bg-transparent hover:bg-secondary-light text-critical border-primary';
    }
  };

  let buttonSize = '';
  switch (size) {
    case Size.S:
      buttonSize = ButtonSize.S;
      break;
    case Size.M:
      buttonSize = ButtonSize.M;
      break;
  }

  let icon = <ArrowBackIcon />;

  switch (action) {
    case Action.ADD:
      icon = <AddCircleIcon />;
      break;
    case Action.ACCEPT:
      icon = <CheckIcon />;
      break;
    case Action.BACK:
      icon = <ArrowBackIcon />;
      break;
    case Action.CANCEL:
      icon = <CancelIcon />;
      break;
    case Action.COMMENT:
      icon = <CommentIcon />;
      break;
    case Action.COPY:
      icon = <CopyIcon />;
      break;
    case Action.DELETE:
      icon = <DeleteIcon />;
      break;
    case Action.DENY:
      icon = <CancelIcon />;
      break;
    case Action.DOWNLOAD:
      icon = <CloudDownloadIcon />;
      break;
    case Action.EDIT:
      icon = <EditIcon />;
      break;
    case Action.GOTOMAP:
      icon = <img src={imgWorld} />;
      break;
    case Action.GOTOEXTERNAL:
      icon = <OpenInNewIcon />;
      break;
    case Action.HIDE:
      icon = <VisibilityOffIcon />;
      break;
    case Action.MANAGE_ACCOMMODATIONS:
      icon = <HotelIcon />;
      break;
    case Action.MANAGE_COMPETITIONS:
      icon = <TrophyIcon />;
      break;
    case Action.MANAGE_OFFERINGS:
      icon = <LocalOfferIcon />;
      break;
    case Action.MANAGE_USERS:
      icon = <PeopleIcon />;
      break;
    case Action.MANAGE_SPONSORS:
      icon = <PaidIcon />;
      break;
    case Action.PLAY:
      icon = <PlayCircleOutlineIcon />;
      break;
    case Action.REMOVE:
      icon = <RemoveCircleIcon />;
      break;
    case Action.SAVE:
      icon = <SaveIcon />;
      break;
    case Action.SEND:
      icon = <SendIcon />;
      break;
    case Action.SHARE:
      icon = <ShareIcon />;
      break;
    case Action.SHOW:
      icon = <VisibilityIcon />;
      break;
  }

  return (
    <button
      className={`
      ${buttonSize} rounded-lg border flex justify-center items-center
      transition-all duration-200 ease-in-out
      transform hover:scale-[1.02] active:scale-[0.98]
      shadow-sm hover:shadow-md
      focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50
      ${getButtonColors()}
    `}
      onClick={onClick}
      aria-label={action.toString().toLowerCase()}
    >
      {icon}
    </button>
  );
};

export default ActionButton;
