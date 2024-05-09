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
  className?: string;
  onChange: (value: any) => void;
}

const ComboBox = ({ menus, value, searchEnabled = false, label = 'Select', className, onChange }: IComboboxProps) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className={cn('min-w-[140px] justify-between bg-transparent hover:border-primary truncate', className)}>
          <div className="truncate">{value ? menus.find((menu) => menu.value === value)?.text : label}</div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn('w-[140px] p-0', className)}>
        <Command>
          {searchEnabled && <CommandInput placeholder="Search ..." />}
          <CommandEmpty>No data found.</CommandEmpty>
          <CommandGroup className={cn('max-h-[300px] overflow-y-auto', className)}>
            {menus.map((menu) => (
              <CommandItem
                key={menu.text}
                value={menu.text}
                onSelect={(currentValue) => {
                  const menuItem = menus.find((item) => {
                    return item.text.toLowerCase() === currentValue.toLowerCase();
                  });

                  setOpen(false);
                  onChange(menuItem?.value);
                }}
              >
                <Check className={cn('mr-2 h-4 w-4', value === menu.value ? 'opacity-100' : 'opacity-0')} />
                {menu.text}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ComboBox;
