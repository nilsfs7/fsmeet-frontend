const Separator = () => {
  return (
    <div className="flex h-1">
      <div className="w-1/3 rounded-l-lg bg-secondary hover:bg-secondary-light"></div>
      <div className="w-1/3 bg-secondary hover:bg-secondary-light"></div>
      <div className="w-1/3 rounded-r-lg bg-secondary hover:bg-secondary-light"></div>
    </div>
  );
};

export default Separator;
