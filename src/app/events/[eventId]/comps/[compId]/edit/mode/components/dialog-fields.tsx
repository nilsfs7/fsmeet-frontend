'use client';

import type { ReactNode } from 'react';
import { IconAlertTriangle } from '@tabler/icons-react';
import { Checkbox } from '@/components/ui/checkbox';
import { MenuItem } from '@/domain/types/menu-item';
import { cn } from '@/lib/utils';

export const dialogFormClassName = 'flex min-w-0 flex-col gap-4 pt-1';

export function DialogField({ label, htmlFor, children, className }: { label: string; htmlFor?: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn('flex min-w-0 flex-col gap-1.5', className)}>
      <label htmlFor={htmlFor} className="text-xs font-medium text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}

export function DialogToggle({ id, label, checked, onCheckedChange }: { id: string; label: string; checked: boolean; onCheckedChange: (checked: boolean) => void }) {
  return (
    <label
      htmlFor={id}
      className={cn(
        'flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors',
        checked ? 'border-brand/40 bg-brand-soft/60' : 'border-border hover:bg-muted/40',
      )}
    >
      <Checkbox id={id} checked={checked} onCheckedChange={v => onCheckedChange(v === true)} className="shrink-0" />
      <span className="text-sm font-medium text-foreground">{label}</span>
    </label>
  );
}

export function DialogStats({ items }: { items: { label: string; value: ReactNode }[] }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {items.map(item => (
        <div key={item.label} className="flex min-w-0 flex-col rounded-xl bg-muted/50 px-3 py-2">
          <span className="text-lg font-semibold leading-tight tabular-nums text-foreground">{item.value}</span>
          <span className="truncate text-xs text-muted-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

/** Native select: popovers opened inside our dialogs fight the dialog focus trap, a native control always works (and uses the OS picker on mobile). */
export function DialogDaySelect({ id, menus, value, onChange }: { id: string; menus: MenuItem[]; value: string; onChange: (value: string) => void }) {
  return (
    <select
      id={id}
      value={value}
      onChange={e => onChange(e.currentTarget.value)}
      className="h-10 w-full min-w-0 rounded-lg border border-input bg-background px-3 text-sm text-foreground shadow-xs outline-hidden focus:border-brand focus:ring-2 focus:ring-brand/20"
    >
      {!menus.some(menu => menu.value === value) && <option value={value} hidden />}
      {menus.map(menu => (
        <option key={menu.value} value={menu.value}>
          {menu.text}
        </option>
      ))}
    </select>
  );
}

export function DialogDeleteNotice({ name, text, hint }: { name: string; text: string; hint?: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-critical/30 bg-critical/5 p-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-critical/10 text-critical">
        <IconAlertTriangle className="h-5 w-5" stroke={1.75} aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="break-words font-semibold text-foreground">{name}</p>
        <p className="text-sm text-muted-foreground">{text}</p>
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </div>
    </div>
  );
}
