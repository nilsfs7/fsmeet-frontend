import { ButtonStyle } from '@/domain/enums/button-style';

interface IButton {
  text: string;
  style?: ButtonStyle;
  onClick?: () => void;
}

const TextButton = ({ text, style = ButtonStyle.DEFAULT, onClick }: IButton) => {
  return (
    <button className={`w-36 rounded-lg border border-secondary-dark ${style === ButtonStyle.DEFAULT ? 'bg-primary' : 'bg-critical'}  p-2 font-bold text-background`} onClick={onClick}>
      {text}
    </button>
  );
};

export default TextButton;
