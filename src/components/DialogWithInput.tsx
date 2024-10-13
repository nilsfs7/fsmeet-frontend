'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import ActionButton from './common/ActionButton';
import { Action } from '@/domain/enums/action';
import TextButton from './common/TextButton';

interface IDialogProps {
  title: string;
  description: string;
  queryParam: string;
  onCancel: () => void;
  onConfirm: (inputText: string) => void;
  cancelText?: string;
  confirmText?: string;
}

const DialogWithInput = ({ title, description, queryParam, onCancel, onConfirm, cancelText, confirmText }: IDialogProps) => {
  const searchParams = useSearchParams();
  const showDialog = searchParams?.get(queryParam);
  const [input, setInput] = useState<string>();

  const clickCancel = () => {
    onCancel();
  };

  const clickConfirm = () => {
    if (input) {
      onConfirm(input);
      onCancel();
    }
  };

  return showDialog === '1' ? (
    <div className="p-2 fixed inset-0 flex flex-col items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-backgound rounded-lg">
        <div className="rounded-t-lg bg-secondary-light p-2 text-center">
          <h1 className="text-2xl">{title}</h1>
        </div>
        <div className="rounded-b-lg bg-background p-2">
          <div className="p-2">{description}</div>
          <div className="flex h-full p-2">
            <textarea
              className={`h-full w-full resize-none rounded-lg p-1`}
              onChange={(e) => {
                setInput(e.currentTarget.value.trim());
              }}
            />
          </div>
          <div className="flex flex-row justify-between p-2">
            {!cancelText && <ActionButton action={Action.CANCEL} onClick={clickCancel} />}
            {cancelText && <TextButton text={cancelText} onClick={clickCancel} />}

            {!confirmText && <ActionButton action={Action.ACCEPT} onClick={clickConfirm} />}
            {confirmText && <TextButton text={confirmText} onClick={clickConfirm} />}
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default DialogWithInput;
