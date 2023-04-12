import { Menu } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';

type MenuItem = {
  text: string;
  value: string | any;
};

interface IDropdownProps {
  menus: MenuItem[];
  defaultMenu?: MenuItem;
  className?: string;
  onChange: (value: string) => void;
}

const Dropdown = ({ menus, defaultMenu, className, onChange }: IDropdownProps) => {
  const [selectedMenu, setSelectedMenu] = useState<string>('');
  const [hoverMenu, setHoverMenu] = useState(false);
  const [rotate, setRotate] = useState(false);

  useEffect(() => {
    if (menus.length > 0 && selectedMenu === '') {
      setSelectedMenu(menus[0].text);
    }
    if (defaultMenu && selectedMenu === '') {
      setSelectedMenu(defaultMenu.text);
    }
  }, [menus, selectedMenu, defaultMenu]);

  const onChangeMenu = (item: MenuItem) => {
    setSelectedMenu(item.text);
    onChange(item.value);
  };

  return (
    <div className={'relative'}>
      <Menu as={'div'} className={`w-48 ${className ?? ''}`}>
        <Menu.Button
          className={` text-secondary text-md flex h-[38px] w-full cursor-pointer items-center justify-between rounded border-[1px] border-black bg-zinc-300 px-5 py-3 font-medium hover:bg-zinc-400 ${
            hoverMenu ? 'bg-zinc-700 text-white' : ''
          }`}
          onMouseEnter={() => setHoverMenu(true)}
          onMouseLeave={() => setHoverMenu(false)}
          onClick={() => {
            setRotate(!rotate);
          }}
        >
          <span>{selectedMenu}</span>
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className={rotate ? 'rotate-180' : ''}>
            <path
              d="M1.53376 4.96199C1.70957 4.78623 1.94799 4.6875 2.19658 4.6875C2.44517 4.6875 2.68358 4.78623 2.85939 4.96199L7.50002 9.60261L12.1406 4.96199C12.3175 4.79121 12.5543 4.69672 12.8001 4.69886C13.0459 4.70099 13.281 4.79959 13.4548 4.97341C13.6287 5.14723 13.7273 5.38236 13.7294 5.62817C13.7315 5.87398 13.637 6.1108 13.4663 6.28761L8.16283 11.5911C7.98702 11.7668 7.74861 11.8655 7.50002 11.8655C7.25142 11.8655 7.01301 11.7668 6.8372 11.5911L1.53376 6.28761C1.35801 6.1118 1.25928 5.87339 1.25928 5.6248C1.25928 5.37621 1.35801 5.13779 1.53376 4.96199Z"
              fill={hoverMenu ? `#F5F5F5` : '#A1A1AA'}
            />
          </svg>
        </Menu.Button>
        <Menu.Items className={'absolute left-0 right-0 top-0 z-10 mt-[50px] overflow-hidden rounded border-[1px] border-black bg-zinc-300 hover:bg-zinc-400  '}>
          <div className={'overflow-hidden'}>
            {menus.map((item, index) => {
              return (
                <Menu.Item key={index} as={Fragment}>
                  {({ active }) => (
                    <div
                      className={`${active && 'bg-zinc-300 text-white'} text-secondary text-md flex h-[38px] w-full cursor-pointer items-center px-5 font-medium`}
                      onClick={() => onChangeMenu(item)}
                    >
                      {item.text}
                    </div>
                  )}
                </Menu.Item>
              );
            })}
          </div>
        </Menu.Items>
      </Menu>
    </div>
  );
};

export default Dropdown;
