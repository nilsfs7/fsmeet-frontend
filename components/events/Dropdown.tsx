import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useState } from 'react';
import { EventType } from '@/types/enums/event-type';

interface IDropdownProps {
  defaultValue: EventType;
  onChange: (value: EventType) => void;
}

const Dropdown = ({ defaultValue, onChange }: IDropdownProps) => {
  const [eventType, setEventType] = useState<EventType>(EventType.COMPETITION);

  const handleChange = (event: SelectChangeEvent) => {
    setEventType(event.target.value as EventType);
    onChange(event.target.value as EventType);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <Select id="select" value={defaultValue} onChange={handleChange}>
          <MenuItem value={EventType.COMPETITION}>Competition</MenuItem>
          <MenuItem value={EventType.MEETING}>Meeting</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default Dropdown;
