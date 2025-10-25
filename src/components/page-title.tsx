interface IPageTitle {
  title: string;
}

const PageTitle = ({ title }: IPageTitle) => {
  return <h1 className="m-2 text-center text-xl">{`${title}`}</h1>;
};

export default PageTitle;
