interface IButton {
  text: string;
  onClick?: () => void;
}

const TextButton = ({ text, onClick }: IButton) => {
  return (
    <button className="w-36 rounded-lg border-2 border-black bg-zinc-300 p-2 font-bold text-black hover:bg-zinc-400" onClick={onClick}>
      {text}
    </button>
  );
};

export default TextButton;
