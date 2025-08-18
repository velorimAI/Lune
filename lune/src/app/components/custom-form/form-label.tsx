'use client';
import { FC, ReactNode } from 'react';
import { Label } from '@/components/ui/label';
import clsx from 'clsx';
import ToolTip from '../custom-tooltip';

type FormLabelProps = {
  className?: string;
  disabled?: boolean;
  inValid?: boolean;
  label?: string;
  required?: boolean;
  tooltip?: string | ReactNode;
  tooltipTriggerIcon?: any;
};

export const FormLabel: FC<FormLabelProps> = ({
  className,
  disabled,
  inValid,
  label,
  required,
  tooltipTriggerIcon,
  tooltip,
}) => {
  return (
    <div className="flex h-fit">
      <span>
        <Label
          className={clsx(
            {
              'text-red-500': inValid,
              'opacity-30 cursor-not-allowed': disabled,
            },
            className
          )}
        >
          {label}
          {required && label && <span style={{ color: 'red' }}> *</span>}
        </Label>
      </span>
      <span className="ml-1">
        {tooltip && (
          <ToolTip hint={tooltip} tooltipTriggerIcon={tooltipTriggerIcon} />
        )}
      </span>
    </div>
  );
};
