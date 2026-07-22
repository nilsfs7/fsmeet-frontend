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
  IconSettings,
  IconShare,
  IconTag,
  IconTrash,
  IconTrophy,
  IconUsers,
} from '@tabler/icons-react';
import Link from 'next/link';
import { Action } from '@/domain/enums/action';
import { Size } from '@/domain/enums/size';
import { imgWorld } from '@/domain/constants/images';
import { ButtonStyle } from '@/domain/enums/button-style';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
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
  [Action.SETTINGS]: { kind: 'icon', Icon: IconSettings },
  [Action.SHARE]: { kind: 'icon', Icon: IconShare },
  [Action.SHOW]: { kind: 'icon', Icon: IconEye },
  [Action.STATISTICS]: { kind: 'icon', Icon: IconChartBar },
};

type ActionIconSize = 'icon' | 'iconSm' | 'iconXs';
type ActionIconVariant = 'actionIcon' | 'actionIconWarning' | 'actionIconCritical';

function styleToVariant(style: ButtonStyle, disabled: boolean): ActionIconVariant {
  if (disabled) {
    return 'actionIcon';
  }
  switch (style) {
    case ButtonStyle.WARNING:
      return 'actionIconWarning';
    case ButtonStyle.CRITICAL:
      return 'actionIconCritical';
    case ButtonStyle.DEFAULT:
    default:
      return 'actionIcon';
  }
}

function sizeToButtonSize(size: Size): ActionIconSize {
  switch (size) {
    case Size.XS:
      return 'iconXs';
    case Size.S:
      return 'iconSm';
    case Size.M:
    case Size.L:
    default:
      return 'icon';
  }
}

function sizeToBoxClass(size: Size) {
  switch (size) {
    case Size.XS:
      return 'h-4 w-4';
    case Size.S:
      return 'h-8 w-8';
    case Size.M:
    case Size.L:
    default:
      return 'h-10 w-10';
  }
}

interface IButton {
  action: Action;
  tooltip?: string;
  size?: Size;
  style?: ButtonStyle;
  disabled?: boolean;
  onClick?: () => void;
  /** In-app route: `Button asChild` + `Link` = one styled anchor (avoids `a` wrapping `button`). Ignored when `disabled`. */
  href?: string;
}

const ActionButton = ({ action, tooltip = '', size = Size.M, style = ButtonStyle.DEFAULT, disabled = false, onClick, href }: IButton) => {
  const variant = styleToVariant(style, disabled);
  const buttonSize = sizeToButtonSize(size);
  const boxClass = sizeToBoxClass(size);
  const iconConfig = ACTION_ICON[action];
  const iconClassName = size === Size.XS ? 'h-full w-full' : 'h-[63%] w-[63%]';
  const ariaLabel = action.toString().toLowerCase();
  const sizeClass = cn(size === Size.XS && 'border-0 shadow-none hover:shadow-none');
  const sponsorCardSurfaceClass = cn(
    'border border-border/60 bg-secondary-light/85 shadow-xs backdrop-blur-sm',
    'supports-[backdrop-filter]:bg-secondary-light/70',
    'transition-all duration-200',
    'hover:border-primary/50 hover:shadow-md',
    'dark:border-border/50 dark:bg-background/60 dark:supports-[backdrop-filter]:bg-background/50 dark:hover:border-primary/40',
    'hover:scale-100 active:scale-100',
  );

  const icon = iconConfig.kind === 'img' ? <img src={iconConfig.src} alt={iconConfig.alt} className={boxClass} /> : <iconConfig.Icon className={iconClassName} stroke={2.0} />;

  const control =
    href && !disabled ? (
      <Button asChild variant={variant} size={buttonSize} className={cn(sizeClass, sponsorCardSurfaceClass)}>
        <Link href={href} aria-label={ariaLabel}>
          {icon}
        </Link>
      </Button>
    ) : (
      <Button
        type="button"
        variant={variant}
        size={buttonSize}
        className={cn(sizeClass, sponsorCardSurfaceClass)}
        disabled={disabled}
        onClick={onClick}
        aria-label={ariaLabel}
      >
        {icon}
      </Button>
    );

  // Disabled buttons do not receive pointer events; wrap so the tooltip can still show on hover/focus.
  const trigger = disabled && tooltip ? <span className="inline-flex cursor-default">{control}</span> : control;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{trigger}</TooltipTrigger>

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
