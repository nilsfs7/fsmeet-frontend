import { ButtonStyle } from '@/domain/enums/button-style';

interface IButton {
  text: string;
  style?: ButtonStyle;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

const TextButton = ({ text, style = ButtonStyle.DEFAULT, disabled = false, onClick, className = '' }: IButton) => {
  // Determine button colors based on style
  const getButtonColors = () => {
    if (disabled) {
      return 'bg-gray-200 text-gray-500 border-gray-300';
    }

    switch (style) {
      case ButtonStyle.DEFAULT:
        return 'bg-primary hover:bg-primary-dark text-white border-transparent';
      case ButtonStyle.CRITICAL:
        return 'bg-critical hover:bg-red-700 text-white border-transparent';
      default:
        return 'bg-primary hover:bg-primary-dark text-white border-transparent';
    }
  };

  return (
    <button
      className={`
        px-4 py-2 rounded-lg font-medium
        transition-all duration-200 ease-in-out
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
