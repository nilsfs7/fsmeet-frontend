import { MenuItem } from '@/types/menu-item';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import MenuItemMaterial from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface IDropdownProps {
  menus: MenuItem[];
  value: string;
  onChange: (value: any) => void;
}

const Dropdown = ({ menus, value, onChange }: IDropdownProps) => {
  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value as any);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <Select id="select" value={value} onChange={handleChange}>
          {menus.map(item => {
            return (
              <MenuItemMaterial key={item.value} value={item.value}>
                {item.text}
              </MenuItemMaterial>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
};

export default Dropdown;
