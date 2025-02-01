import { ReactNode } from 'react';

interface IRow {
  children?: ReactNode;
}

export const Row = ({ children }: IRow) => {
  return <div className="w-fit flex p-2 gap-6 items-center">{children}</div>;
};
