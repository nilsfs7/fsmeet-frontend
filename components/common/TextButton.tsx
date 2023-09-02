interface IButton {
  text: string;
  onClick?: () => void;
}

const TextButton = ({ text, onClick }: IButton) => {
  return (
    <button className="w-36 rounded-lg border border-black bg-primary-light p-2 font-bold text-black hover:bg-primary" onClick={onClick}>
      {text}
    </button>
  );
};

export default TextButton;
