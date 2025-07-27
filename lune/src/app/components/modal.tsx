import { FC, ReactNode } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from '@/components/ui/alert-dialog';
import { Loader2, X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

type ModalProps = {
  open: boolean;
  title?: ReactNode;
  children?: ReactNode;
  contentClassName?: string;
  hideFooter?: boolean;
  onCancel?: (value?: any) => void;
  hideCancel?: boolean;
  cancelText?: string;
  onConfirm?: (value?: any) => void;
  hideConfirm?: boolean;
  confirmText?: string;
  confirmLoading?: boolean;
  confirmDisabled?: boolean;
  hideCloseIcon?: boolean;
};

export const Modal: FC<ModalProps> = (props) => {
  const {
    open,
    title,
    children,
    contentClassName,
    hideFooter,
    onCancel,
    hideCancel,
    cancelText = 'Cancel',
    onConfirm,
    hideConfirm,
    confirmText = 'Confirm',
    confirmDisabled,
    confirmLoading,
    hideCloseIcon,
  } = props;

  return (
    <AlertDialog open={open}>
      <AlertDialogContent
        onClick={(e) => e.stopPropagation()}
        className={cn(contentClassName, 'dark:bg-box-background')}
        onOpenAutoFocus={(e) => e.preventDefault()}
        // onInteractOutside={(e) => e.preventDefault()}
      >
        <AlertDialogHeader className="dark:text-zinc-300">
          <AlertDialogTitle className="flex justify-between items-center dark:text-zinc-300">
            {title}
            {!hideCloseIcon && (
              <X
                className="cursor-pointer dark:text-zinc-400"
                onClick={(e) => onCancel && onCancel(e)}
              />
            )}
          </AlertDialogTitle>
          <Separator className="my-4" />
          <AlertDialogDescription />
          {children}
        </AlertDialogHeader>
        {!hideFooter && (
          <AlertDialogFooter>
            {!hideCancel && (
              <AlertDialogCancel
                className="dark:text-zinc-300 dark:bg-box-brighter"
                onClick={(e) => onCancel && onCancel(e)}
              >
                {cancelText}
              </AlertDialogCancel>
            )}
            {!hideConfirm && (
              <AlertDialogAction
                onClick={(e) => onConfirm && onConfirm(e)}
                disabled={confirmLoading || confirmDisabled}
              >
                {confirmLoading && <Loader2 className="animate-spin" />}
                {confirmText}
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};
