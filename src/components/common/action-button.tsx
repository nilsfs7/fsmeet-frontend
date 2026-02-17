import { Action } from '@/domain/enums/action';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ArrowBackIcon from '@mui/icons-material/KeyboardBackspace';
import BarChartIcon from '@mui/icons-material/BarChart';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckIcon from '@mui/icons-material/CheckCircle';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CommentIcon from '@mui/icons-material/QuestionAnswerOutlined';
import CopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import HotelIcon from '@mui/icons-material/Hotel';
import InfoIcon from '@mui/icons-material/Info';
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface IButton {
  action: Action;
  tooltip?: string;
  size?: Size;
  style?: ButtonStyle;
  onClick?: () => void;
}

enum ButtonSize {
  XS = 'h-4 w-4',
  S = 'h-8 w-8',
  M = 'h-10 w-10',
}

const ActionButton = ({ action, tooltip = '', size = Size.M, style = ButtonStyle.DEFAULT, onClick }: IButton) => {
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
    case Size.XS:
      buttonSize = ButtonSize.XS;
      break;
    case Size.S:
      buttonSize = ButtonSize.S;
      break;
    case Size.M:
      buttonSize = ButtonSize.M;
      break;
  }

  let Icon = ArrowBackIcon;

  switch (action) {
    case Action.ADD:
      Icon = AddCircleIcon;
      break;
    case Action.ACCEPT:
      Icon = CheckIcon;
      break;
    case Action.BACK:
      Icon = ArrowBackIcon;
      break;
    case Action.CANCEL:
      Icon = CancelIcon;
      break;
    case Action.COMMENT:
      Icon = CommentIcon;
      break;
    case Action.COPY:
      Icon = CopyIcon;
      break;
    case Action.DELETE:
      Icon = DeleteIcon;
      break;
    case Action.DENY:
      Icon = CancelIcon;
      break;
    case Action.DOWNLOAD:
      Icon = CloudDownloadIcon;
      break;
    case Action.EDIT:
      Icon = EditIcon;
      break;
    case Action.GOTOEXTERNAL:
      Icon = OpenInNewIcon;
      break;
    case Action.HIDE:
      Icon = VisibilityOffIcon;
      break;
    case Action.INFO:
      Icon = InfoIcon;
      break;
    case Action.MANAGE_ACCOMMODATIONS:
      Icon = HotelIcon;
      break;
    case Action.MANAGE_ATTACHMENTS:
      Icon = FilePresentIcon;
      break;
    case Action.MANAGE_COMPETITIONS:
      Icon = TrophyIcon;
      break;
    case Action.MANAGE_OFFERINGS:
      Icon = LocalOfferIcon;
      break;
    case Action.MANAGE_USERS:
      Icon = PeopleIcon;
      break;
    case Action.MANAGE_SPONSORS:
      Icon = PaidIcon;
      break;
    case Action.PLAY:
      Icon = PlayCircleOutlineIcon;
      break;
    case Action.REMOVE:
      Icon = RemoveCircleIcon;
      break;
    case Action.SAVE:
      Icon = SaveIcon;
      break;
    case Action.SEND:
      Icon = SendIcon;
      break;
    case Action.SHARE:
      Icon = ShareIcon;
      break;
    case Action.SHOW:
      Icon = VisibilityIcon;
      break;
    case Action.STATISTICS:
      Icon = BarChartIcon;
      break;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            className={`
      ${buttonSize} rounded-lg ${size !== Size.XS && 'border'} flex justify-center items-center
      transition-all duration-200 ease-in-out
      transform hover:scale-[1.02] active:scale-[0.98]
      shadow-sm hover:shadow-md
      focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50
      ${getButtonColors()}
    `}
            onClick={onClick}
            aria-label={action.toString().toLowerCase()}
          >
            {/* todo: add map for non default icons */}
            {action === Action.GOTOMAP ? <img src={imgWorld} className={buttonSize} /> : <Icon sx={{ width: Size.XS === size ? '100%' : '63%', height: Size.XS === size ? '100%' : '63%' }} />}
          </button>
        </TooltipTrigger>

        {tooltip && (
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

export default ActionButton;
