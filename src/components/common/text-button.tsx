import { ButtonStyle } from '@/domain/enums/button-style';

interface IButton {
  text: string;
  style?: ButtonStyle;
  disabled?: boolean;
  id?: string;
  className?: string;
  onClick?: () => void;
}

const TextButton = ({ text, style = ButtonStyle.DEFAULT, disabled = false, id, className = '', onClick }: IButton) => {
  const getButtonColors = () => {
    if (disabled) {
      return 'bg-secondary-light text-primary';
    }

    switch (style) {
      case ButtonStyle.DEFAULT:
        return 'bg-primary hover:bg-primary-dark text-background';
      case ButtonStyle.CRITICAL:
        return 'bg-critical hover:bg-critical-dark text-background';
      default:
    }
  };

  return (
    <button
      id={id}
      className={`
      min-w-36 p-2 rounded-lg font-medium
      transition-all duration-20000 ease-in-out
      transform hover:scale-[1.02] active:scale-[0.98]
      shadow-sm hover:shadow-md
      focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50
      ${getButtonColors()}
      ${className}
    `}
      disabled={disabled}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default TextButton;
