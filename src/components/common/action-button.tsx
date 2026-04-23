import type { ComponentType } from 'react';
import {
  IconArrowLeft,
  IconBuilding,
  IconChartBar,
  IconCircleCheck,
  IconCircleMinus,
  IconCirclePlus,
  IconCircleX,
  IconCloudDownload,
  IconCoin,
  IconCopy,
  IconDeviceFloppy,
  IconDeviceTv,
  IconExternalLink,
  IconEye,
  IconEyeOff,
  IconFile,
  IconInfoCircle,
  IconMessage2,
  IconPencil,
  IconPlayerPlay,
  IconSend,
  IconShare,
  IconTag,
  IconTrash,
  IconTrophy,
  IconUsers,
} from '@tabler/icons-react';
import { Action } from '@/domain/enums/action';
import { Size } from '@/domain/enums/size';
import { imgWorld } from '@/domain/constants/images';
import { ButtonStyle } from '@/domain/enums/button-style';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type TablerActionIcon = ComponentType<{ className?: string; stroke?: number }>;

type ActionIconConfig = { kind: 'icon'; Icon: TablerActionIcon } | { kind: 'img'; src: string; alt: string };

/** Tabler icon for each action; `GOTOMAP` uses a raster asset. */
const ACTION_ICON: Record<Action, ActionIconConfig> = {
  [Action.ADD]: { kind: 'icon', Icon: IconCirclePlus },
  [Action.ACCEPT]: { kind: 'icon', Icon: IconCircleCheck },
  [Action.BACK]: { kind: 'icon', Icon: IconArrowLeft },
  [Action.CANCEL]: { kind: 'icon', Icon: IconCircleX },
  [Action.COMMENT]: { kind: 'icon', Icon: IconMessage2 },
  [Action.COPY]: { kind: 'icon', Icon: IconCopy },
  [Action.DENY]: { kind: 'icon', Icon: IconCircleX },
  [Action.DELETE]: { kind: 'icon', Icon: IconTrash },
  [Action.DOWNLOAD]: { kind: 'icon', Icon: IconCloudDownload },
  [Action.EDIT]: { kind: 'icon', Icon: IconPencil },
  [Action.GOTOMAP]: { kind: 'img', src: imgWorld, alt: '' },
  [Action.GOTOEXTERNAL]: { kind: 'icon', Icon: IconExternalLink },
  [Action.HIDE]: { kind: 'icon', Icon: IconEyeOff },
  [Action.INFO]: { kind: 'icon', Icon: IconInfoCircle },
  [Action.MANAGE_ACCOMMODATIONS]: { kind: 'icon', Icon: IconBuilding },
  [Action.MANAGE_ARENA_SCREEN]: { kind: 'icon', Icon: IconDeviceTv },
  [Action.MANAGE_ATTACHMENTS]: { kind: 'icon', Icon: IconFile },
  [Action.MANAGE_COMPETITIONS]: { kind: 'icon', Icon: IconTrophy },
  [Action.MANAGE_OFFERINGS]: { kind: 'icon', Icon: IconTag },
  [Action.MANAGE_USERS]: { kind: 'icon', Icon: IconUsers },
  [Action.MANAGE_SPONSORS]: { kind: 'icon', Icon: IconCoin },
  [Action.PLAY]: { kind: 'icon', Icon: IconPlayerPlay },
  [Action.REMOVE]: { kind: 'icon', Icon: IconCircleMinus },
  [Action.SAVE]: { kind: 'icon', Icon: IconDeviceFloppy },
  [Action.SEND]: { kind: 'icon', Icon: IconSend },
  [Action.SHARE]: { kind: 'icon', Icon: IconShare },
  [Action.SHOW]: { kind: 'icon', Icon: IconEye },
  [Action.STATISTICS]: { kind: 'icon', Icon: IconChartBar },
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
  const iconClassName = size === Size.XS ? 'h-full w-full' : 'h-[63%] w-[63%]';

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
            {iconConfig.kind === 'img' ? <img src={iconConfig.src} alt={iconConfig.alt} className={buttonSize} /> : <iconConfig.Icon className={iconClassName} stroke={2.0} />}
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
