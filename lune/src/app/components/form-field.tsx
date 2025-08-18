'use client';
import { Input } from '@/components/ui/input';
import { cn } from '@/app/utils/cn';
import { UseFormRegisterReturn } from 'react-hook-form';

interface FormFieldProps {
  label?: string;
  name?: string;
  placeholder?: string;
  register?: UseFormRegisterReturn;
  error?: string;
  className?: string;
  defaultValue?: string;
  width?: string;
  reqiured?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  type?: string;
}

export const FormField = ({
  label,
  name,
  placeholder,
  register,
  error,
  width,
  className,
  reqiured,
  disabled,
  readOnly,
  type,
  defaultValue,
}: FormFieldProps) => {
  return (
    <div className={cn('flex flex-col w-full h-16 gap-1 select-none', width)}>
      <div className={cn('flex justify-center items-center gap-5', className)}>
        <span className="text-gray-500 w-56">
          {label}
          {reqiured && <span style={{ color: 'red' }}> *</span>}
        </span>
        <Input
          name={name}
          type={type}
          disabled={disabled}
          readOnly={readOnly}
          className=""
          defaultValue={defaultValue || ''}
          placeholder={placeholder}
          {...register}
        />
      </div>
      {error && (
        <p className="text-red-500 w-full flex justify-start text-xs">
          {error}
        </p>
      )}
    </div>
  );
};
