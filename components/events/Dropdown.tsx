import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { EventType } from '@/types/enums/event-type';

interface IDropdownProps {
  value: EventType;
  onChange: (value: EventType) => void;
}

const Dropdown = ({ value, onChange }: IDropdownProps) => {
  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value as EventType);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <Select id="select" value={value} onChange={handleChange}>
          <MenuItem value={EventType.COMPETITION}>Competition</MenuItem>
          <MenuItem value={EventType.MEETING}>Meeting</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default Dropdown;
