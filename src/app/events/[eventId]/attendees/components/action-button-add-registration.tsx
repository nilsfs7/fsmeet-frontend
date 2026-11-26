'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import ActionButton from '@/components/common/action-button';
import { Check } from 'lucide-react';
import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Action } from '@/domain/enums/action';
import { EventType } from '@/domain/enums/event-type';
import { UserType } from '@/domain/enums/user-type';
import { EventRegistrationType } from '@/domain/types/event-registration-type';
import { User } from '@/domain/types/user';
import { createEventRegistrationOnBehalf } from '@/infrastructure/clients/event.client';
import { cn } from '@/lib/utils';

function userMenuText(user: User): string {
  const name = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
  return name ? `${name} (${user.username})` : user.username;
}

interface IActionButtonAddRegistration {
  eventId: string;
  eventType: EventType;
  /** Users that can still be added, i.e. without a registration for this event. */
  users: User[];
}

export const ActionButtonAddRegistration = ({ eventId, eventType, users }: IActionButtonAddRegistration) => {
  const t = useTranslations('/events/eventid/attendees');
  const tUi = useTranslations('global/ui');
  const { data: session } = useSession();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [registrationType, setRegistrationType] = useState<EventRegistrationType>(EventRegistrationType.PARTICIPANT);
  const [saving, setSaving] = useState(false);

  const menus = useMemo(
    () =>
      users
        .map(user => ({ text: userMenuText(user), value: user.username }))
        .sort((a, b) => a.text.localeCompare(b.text, undefined, { sensitivity: 'base' })),
    [users],
  );

  const selectedUser = users.find(user => user.username === username);
  const visitorAllowed = eventType !== EventType.COMPETITION_ONLINE;
  const participantAllowed = selectedUser?.type !== UserType.FAN;

  const handleUserChanged = (value: string) => {
    setUsername(value);
    const user = users.find(u => u.username === value);
    if (user?.type === UserType.FAN && visitorAllowed) setRegistrationType(EventRegistrationType.VISITOR);
  };

  const handleOpenChanged = (next: boolean) => {
    if (saving) return;
    setOpen(next);
    if (!next) {
      setUsername('');
      setRegistrationType(EventRegistrationType.PARTICIPANT);
    }
  };

  const handleAddClicked = async () => {
    if (!username) return;
    setSaving(true);
    try {
      await createEventRegistrationOnBehalf(eventId, username, registrationType, session);
      toast.success(t('toastAdded', { name: username }));
      setSaving(false);
      handleOpenChanged(false);
      router.refresh();
    } catch (error: any) {
      setSaving(false);
      toast.error(error.message);
      console.error(error.message);
    }
  };

  const typeOptions = [
    { type: EventRegistrationType.PARTICIPANT, label: t('regTypeParticipant'), disabled: !participantAllowed },
    ...(visitorAllowed ? [{ type: EventRegistrationType.VISITOR, label: t('regTypeVisitor'), disabled: false }] : []),
  ];

  return (
    <>
      <ActionButton action={Action.ADD} tooltip={t('dlgAddRegistrationTitle')} onClick={() => setOpen(true)} />

      <Dialog open={open} onOpenChange={handleOpenChanged}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('dlgAddRegistrationTitle')}</DialogTitle>
            <DialogDescription>{t('dlgAddRegistrationText')}</DialogDescription>
          </DialogHeader>

          <div className="flex min-w-0 flex-col gap-4 text-sm">
            <div className="flex min-w-0 flex-col gap-1.5">
              <span className="font-medium text-foreground/80">{t('dlgAddRegistrationUser')}</span>
              {menus.length > 0 ? (
                <Command className="rounded-lg border border-border">
                  <CommandInput placeholder={tUi('search')} />
                  <CommandList className="max-h-56">
                    <CommandEmpty>{tUi('noData')}</CommandEmpty>
                    <CommandGroup>
                      {menus.map(menu => (
                        <CommandItem key={menu.value} value={menu.text} onSelect={() => handleUserChanged(menu.value)}>
                          <Check className={cn('mr-2 h-4 w-4 shrink-0', username === menu.value ? 'opacity-100' : 'opacity-0')} />
                          <span className="truncate">{menu.text}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              ) : (
                <p className="text-muted-foreground">{t('dlgAddRegistrationNoUsers')}</p>
              )}
            </div>

            <div className="flex min-w-0 flex-col gap-1.5">
              <span className="font-medium text-foreground/80">{t('dlgAddRegistrationType')}</span>
              <RadioGroup value={registrationType} onValueChange={value => setRegistrationType(value as EventRegistrationType)} className="gap-2">
                {typeOptions.map(option => (
                  <label key={option.type} htmlFor={`add-registration-${option.type}`} className="flex cursor-pointer items-center gap-2 has-disabled:cursor-not-allowed has-disabled:opacity-50">
                    <RadioGroupItem value={option.type} id={`add-registration-${option.type}`} disabled={option.disabled} />
                    {option.label}
                  </label>
                ))}
              </RadioGroup>
              {!participantAllowed && <p className="text-xs text-muted-foreground">{t('dlgAddRegistrationFanHint')}</p>}
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              variant="action"
              className={ctaActionButtonClassName}
              disabled={!username || saving || (registrationType === EventRegistrationType.PARTICIPANT && !participantAllowed)}
              onClick={() => void handleAddClicked()}
            >
              {t('dlgAddRegistrationConfirm')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
