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

enum IconSize {
  S = 'h-4 w-4',
  M = 'h-5 w-5',
  L = 'h-6 w-6',
}

enum ButtonSize {
  S = 'h-8 w-8',
  M = 'h-10 w-10',
  L = 'h-12 w-12',
}

const ActionButton = ({ action, size = Size.M, style = ButtonStyle.DEFAULT, onClick }: IButton) => {
  // Determine button colors based on style
  const getButtonColors = () => {
    switch (style) {
      case ButtonStyle.DEFAULT:
        return 'bg-white hover:bg-gray-50 text-primary border border-primary';
      case ButtonStyle.WARNING:
        return 'bg-white hover:bg-gray-50 text-warning border border-warning';
      case ButtonStyle.CRITICAL:
        return 'bg-white hover:bg-gray-50 text-critical border border-critical';
      default:
        return 'bg-white hover:bg-gray-50 text-primary border border-primary';
    }
  };

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

  const className = `${iconSize} text-current`;

  let icon = <ArrowBackIcon className={className} />;

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
    case Action.GOTOMAP:
      icon = <img src={imgWorld} className={className} alt="Map" />;
      break;
    case Action.GOTOEXTERNAL:
      icon = <OpenInNewIcon className={className} />;
      break;
    case Action.HIDE:
      icon = <VisibilityOffIcon className={className} />;
      break;
    case Action.MANAGE_ACCOMMODATIONS:
      icon = <HotelIcon className={className} />;
      break;
    case Action.MANAGE_COMPETITIONS:
      icon = <TrophyIcon className={className} />;
      break;
    case Action.MANAGE_OFFERINGS:
      icon = <LocalOfferIcon className={className} />;
      break;
    case Action.MANAGE_USERS:
      icon = <PeopleIcon className={className} />;
      break;
    case Action.MANAGE_SPONSORS:
      icon = <PaidIcon className={className} />;
      break;
    case Action.PLAY:
      icon = <PlayCircleOutlineIcon className={className} />;
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
  }

  return (
    <button
      className={`
        ${buttonSize} rounded-lg flex justify-center items-center
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
