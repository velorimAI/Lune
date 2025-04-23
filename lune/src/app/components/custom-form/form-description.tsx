import { FC, ReactNode } from 'react';
import clsx from 'clsx';

type FormDescriptionProps = {
  hint?: ReactNode;
  error?: boolean;
  className?: string;
};

export const FormDescription: FC<FormDescriptionProps> = ({
  hint,
  error,
  className,
}) => {
  return (
    <p
      className={clsx('text-esm text-muted-foreground', className, {
        'text-red-500': error,
      })}
    >
      {error || hint}
    </p>
  );
};
