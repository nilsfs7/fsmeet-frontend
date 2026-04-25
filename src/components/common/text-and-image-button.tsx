import Image from 'next/image';
import { cn } from '@/lib/utils';

interface IButton {
  text: string;
  image: string;
  onClick?: () => void;
}

const buttonSurfaceClass = cn(
  'flex w-44 min-w-0 flex-col items-center gap-2 rounded-xl border border-border/60 bg-secondary-light/85 p-2.5 text-center shadow-xs backdrop-blur-sm',
  'supports-[backdrop-filter]:bg-secondary-light/70',
  'dark:border-border/50 dark:bg-background/60 dark:supports-[backdrop-filter]:bg-background/50',
  'text-sm font-semibold leading-tight text-foreground/90 transition-colors',
  'hover:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
);

const TextAndImageButton = ({ text, image, onClick }: IButton) => {
  return (
    <button type="button" className={buttonSurfaceClass} onClick={onClick}>
      <Image src={image} width={0} height={0} sizes="100vw" className="h-12 w-full object-contain" alt="" />
      <span className="min-w-0 text-balance">{text}</span>
    </button>
  );
};

export default TextAndImageButton;
