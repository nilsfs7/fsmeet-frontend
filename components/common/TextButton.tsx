interface IButton {
  text: string;
  onClick?: () => void;
}

const TextButton = ({ text, onClick }: IButton) => {
  return (
    <button className="w-36 rounded-lg border border-secondary-dark bg-primary p-2 font-bold text-background" onClick={onClick}>
      {text}
    </button>
  );
};

export default TextButton;
