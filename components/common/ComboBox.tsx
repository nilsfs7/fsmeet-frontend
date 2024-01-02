'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MenuItem } from '@/types/menu-item';

interface IComboboxProps {
  menus: MenuItem[];
  value: string;
  searchEnabled?: boolean;
  label?: string;
  onChange: (value: any) => void;
}

const ComboBox = ({ menus, value, searchEnabled = false, label = 'Select', onChange }: IComboboxProps) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-[340px] justify-between bg-transparent hover:border-primary truncate">
          <div className="truncate">{value ? menus.find(menu => menu.value.toLocaleLowerCase() === value.toLocaleLowerCase())?.value : label}</div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          {searchEnabled && <CommandInput placeholder="Search ..." />}
          <CommandEmpty>No data found.</CommandEmpty>
          <CommandGroup>
            {menus.map(menu => (
              <CommandItem
                key={menu.value}
                value={menu.value}
                onSelect={currentValue => {
                  const val = currentValue === value ? '' : currentValue;

                  // setValue(val);
                  setOpen(false);
                  onChange(val);
                }}
              >
                <Check className={cn('mr-2 h-4 w-4', value === menu.value ? 'opacity-100' : 'opacity-0')} />
                {menu.value}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ComboBox;
