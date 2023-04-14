interface IButton {
  text: string;
  onClick: () => void;
}

const MenuButton = ({ text, onClick }: IButton) => {
  return (
    <button className="w-48 rounded-lg border-[2px] border-black bg-zinc-300 px-4 py-2 font-bold text-black hover:bg-zinc-400" onClick={onClick}>
      {text}
    </button>
  );
};

export default MenuButton;
