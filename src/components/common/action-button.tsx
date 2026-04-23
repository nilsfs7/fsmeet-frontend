import type { ComponentType } from 'react';
import type { SvgIconProps } from '@mui/material/SvgIcon';
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
import TvIcon from '@mui/icons-material/Tv';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Size } from '@/domain/enums/size';
import { imgWorld } from '@/domain/constants/images';
import { ButtonStyle } from '@/domain/enums/button-style';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type MuiSvgIcon = ComponentType<SvgIconProps>;

type ActionIconConfig =
  | { kind: 'mui'; Icon: MuiSvgIcon }
  | { kind: 'img'; src: string; alt: string };

/** MUI icon for each action; `GOTOMAP` uses a raster asset. */
const ACTION_ICON: Record<Action, ActionIconConfig> = {
  [Action.ADD]: { kind: 'mui', Icon: AddCircleIcon },
  [Action.ACCEPT]: { kind: 'mui', Icon: CheckIcon },
  [Action.BACK]: { kind: 'mui', Icon: ArrowBackIcon },
  [Action.CANCEL]: { kind: 'mui', Icon: CancelIcon },
  [Action.COMMENT]: { kind: 'mui', Icon: CommentIcon },
  [Action.COPY]: { kind: 'mui', Icon: CopyIcon },
  [Action.DENY]: { kind: 'mui', Icon: CancelIcon },
  [Action.DELETE]: { kind: 'mui', Icon: DeleteIcon },
  [Action.DOWNLOAD]: { kind: 'mui', Icon: CloudDownloadIcon },
  [Action.EDIT]: { kind: 'mui', Icon: EditIcon },
  [Action.GOTOMAP]: { kind: 'img', src: imgWorld, alt: '' },
  [Action.GOTOEXTERNAL]: { kind: 'mui', Icon: OpenInNewIcon },
  [Action.HIDE]: { kind: 'mui', Icon: VisibilityOffIcon },
  [Action.INFO]: { kind: 'mui', Icon: InfoIcon },
  [Action.MANAGE_ACCOMMODATIONS]: { kind: 'mui', Icon: HotelIcon },
  [Action.MANAGE_ARENA_SCREEN]: { kind: 'mui', Icon: TvIcon },
  [Action.MANAGE_ATTACHMENTS]: { kind: 'mui', Icon: FilePresentIcon },
  [Action.MANAGE_COMPETITIONS]: { kind: 'mui', Icon: TrophyIcon },
  [Action.MANAGE_OFFERINGS]: { kind: 'mui', Icon: LocalOfferIcon },
  [Action.MANAGE_USERS]: { kind: 'mui', Icon: PeopleIcon },
  [Action.MANAGE_SPONSORS]: { kind: 'mui', Icon: PaidIcon },
  [Action.PLAY]: { kind: 'mui', Icon: PlayCircleOutlineIcon },
  [Action.REMOVE]: { kind: 'mui', Icon: RemoveCircleIcon },
  [Action.SAVE]: { kind: 'mui', Icon: SaveIcon },
  [Action.SEND]: { kind: 'mui', Icon: SendIcon },
  [Action.SHARE]: { kind: 'mui', Icon: ShareIcon },
  [Action.SHOW]: { kind: 'mui', Icon: VisibilityIcon },
  [Action.STATISTICS]: { kind: 'mui', Icon: BarChartIcon },
};

interface IButton {
  action: Action;
  tooltip?: string;
  size?: Size;
  style?: ButtonStyle;
  disabled?: boolean;
  onClick?: () => void;
}

enum ButtonSize {
  XS = 'h-4 w-4',
  S = 'h-8 w-8',
  M = 'h-10 w-10',
}

const ActionButton = ({ action, tooltip = '', size = Size.M, style = ButtonStyle.DEFAULT, disabled = false, onClick }: IButton) => {
  const getButtonColors = () => {
    if (disabled) {
      return 'bg-secondary-light text-secondary-dark';
    }

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

  const iconConfig = ACTION_ICON[action];
  const muiSx = { width: Size.XS === size ? '100%' : '63%', height: Size.XS === size ? '100%' : '63%' } as const;

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
            disabled={disabled}
            onClick={onClick}
            aria-label={action.toString().toLowerCase()}
          >
            {iconConfig.kind === 'img' ? (
              <img src={iconConfig.src} alt={iconConfig.alt} className={buttonSize} />
            ) : (
              <iconConfig.Icon sx={muiSx} />
            )}
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
