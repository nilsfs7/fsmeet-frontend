import { ButtonStyle } from '@/domain/enums/button-style';

interface IButton {
  text: string;
  style?: ButtonStyle;
  disabled?: boolean;
  onClick?: () => void;
}

const TextButton = ({ text, style = ButtonStyle.DEFAULT, disabled = false, onClick }: IButton) => {
  return (
    <button
      className={`w-36 rounded-lg border border-secondary-dark ${disabled ? 'bg-secondary-light' : style === ButtonStyle.DEFAULT ? 'bg-primary' : 'bg-critical'}  p-2 font-bold ${disabled ? 'text-primary' : 'text-background'}`}
      disabled={disabled}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default TextButton;
