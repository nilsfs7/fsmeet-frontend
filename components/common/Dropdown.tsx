import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

export type MenuItem = {
  text: string;
  value: string;
};

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
              <MenuItem key={item.value} value={item.value}>
                {item.text}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
};

export default Dropdown;
