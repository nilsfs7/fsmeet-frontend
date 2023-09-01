interface IButton {
  text: string;
  onClick?: () => void;
}

const TextButton = ({ text, onClick }: IButton) => {
  return (
    <button className="w-36 rounded-lg bg-primary-light p-2 font-bold text-[#000000] hover:bg-primary hover:text-background" onClick={onClick}>
      {text}
    </button>
  );
};

export default TextButton;
