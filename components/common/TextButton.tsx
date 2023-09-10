interface IButton {
  text: string;
  onClick?: () => void;
}

const TextButton = ({ text, onClick }: IButton) => {
  return (
    <button className="w-36 rounded-lg border border-border bg-action-bg p-2 font-bold text-action-font" onClick={onClick}>
      {text}
    </button>
  );
};

export default TextButton;
