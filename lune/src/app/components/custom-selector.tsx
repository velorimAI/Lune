'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/app/utils/cn';
import { ReactNode } from 'react';

interface TProps {
  options?: { value: string; label: string }[];
  label?: ReactNode;
  required?: boolean;
  width?: string;
  currentValue?: string;
  onChange?: (value?: any) => void;
}
function CustomSelector({
  options = [],
  label,
  required,
  width,
  currentValue,
  onChange,
}: TProps) {
  return (
    <div className={cn('flex w-full flex-col', width)}>
      <p className="w-36 text-gray-500">
        {label}
        {required && <span style={{ color: 'red' }}> *</span>}
      </p>
      <Select
        onValueChange={(value) => {
          if (onChange) onChange(value);
        }}
      >
        <SelectTrigger className="w-full dark:bg-box-brighter dark:border-none">
          <SelectValue placeholder={currentValue} />
        </SelectTrigger>
        <SelectContent className="dark:text-zinc-400 dark:border-none dark:shadow-inner dark:shadow-card">
          {options?.map((item, index) => (
            <SelectItem
              key={index}
              value={item?.value}
              className="dark:hover:bg-box-brighter dark:hover:text-zinc-400"
            >
              {item?.label || ''}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default CustomSelector;
