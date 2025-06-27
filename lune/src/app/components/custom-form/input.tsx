'use client';

import {
  FC,
  ReactNode,
  ChangeEvent,
  useState,
  useImperativeHandle,
  forwardRef,
  ForwardRefRenderFunction,
} from 'react';
import { Input as InputShadcn } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Eye, EyeOff, CircleX } from 'lucide-react';
import { Button } from '../button';
import { FormLabel } from './form-label';
import { FormDescription } from './form-description';
import { useFormField } from '@/app/hooks/form/useFormField';
import { useFormFieldValidations } from '@/app/hooks/form/useFormFieldValidations';

export type InputRefHandle = {
  clear: () => void;
};

type InputProps = {
  submitButton?: {
    status: boolean;
    text: ReactNode;
    className?: string;
    type?: any;
    onClick?: () => void;
    isLoading?: boolean;
  };
  className?: string;
  clearable?: boolean;
  disabled?: boolean;
  email?: boolean;
  errorMessage?: string;
  hint?: ReactNode;
  inline?: boolean;
  inputStyle?: string;
  ip?: boolean;
  label?: string;
  name?: string;
  onChange?: (value?: string) => void;
  phone?: boolean;
  idNumber?: boolean;
  placeholder?: string;
  readOnly?: boolean;
  required?: boolean;
  strongPassword?: boolean;
  type?: string;
  value?: string;
  inputClassName?: string;
  tooltip?: string | ReactNode;
  tooltipTriggerIcon?: any;
  isPositiveNumber?: boolean;
};

const InputComponent: ForwardRefRenderFunction<InputRefHandle, InputProps> = (
  props,
  ref
) => {
  const {
    submitButton = {
      status: false,
      text: '',
      className: '',
      type: 'button',
      onClick: () => {},
      isLoading: false,
    },
    className,
    clearable = false,
    disabled,
    email,
    errorMessage,
    hint,
    inline = false,
    inputStyle,
    ip,
    label,
    name,
    onChange,
    placeholder,
    readOnly,
    required,
    strongPassword,
    type,
    value = '',
    phone,
    inputClassName,
    tooltipTriggerIcon,
    tooltip,
    isPositiveNumber,
    idNumber,
  } = props;

  const [eyeOff, setEye] = useState<boolean>(true);
  const [internalValue, setInternalValue] = useState<string>(value || '');

  const fieldValidation = useFormFieldValidations({
    validations: {
      required,
      email,
      strongPassword,
      ip,
      phone,
      isPositiveNumber,
      idNumber,
    },
    label,
  });

  const formField = useFormField({
    name,
    validations: fieldValidation,
    initialValue: value === null ? '' : value,
  });

  const handleChange = (event: ChangeEvent<{ value: string }>) => {
    const val = event?.target?.value;
    setInternalValue(val);
    formField.setValueState(val);
    onChange?.(val);
  };

  const handleType = () => {
    if (type === 'password') {
      return eyeOff ? 'password' : 'text';
    }
    return type;
  };

  const handleClear = () => {
    setInternalValue('');
    formField.setValueState('');
    onChange?.('');
  };

  useImperativeHandle(ref, () => ({
    clear: handleClear,
  }));

  return (
    <div
      className={cn(
        `min-h-[80px] ${inline && 'flex w-full justify-start gap-3 items-center'}`,
        className
      )}
    >
      <FormLabel
        className="dark:text-zinc-400 shrink-0 mb-2"
        inValid={!!formField?.error}
        disabled={disabled}
        label={label}
        required={required}
        tooltipTriggerIcon={tooltipTriggerIcon}
        tooltip={tooltip}
      />
      <div
        className={cn('w-full flex', {
          relative: type === 'password' || clearable,
        })}
      >
        <InputShadcn
          {...formField.fieldRegister}
          className={cn(
            submitButton?.status ? 'rounded-r-none dark:focus:ring-0' : '',
            inputStyle,
            type === 'number' ? 'no-spinner' : '',
            inputClassName
          )}
          disabled={disabled}
          onChange={handleChange}
          placeholder={placeholder}
          readOnly={readOnly}
          type={handleType()}
          value={internalValue}
        />

        {submitButton?.status && (
          <Button
            disabled={disabled}
            type={submitButton?.type || 'button'}
            isLoading={submitButton?.isLoading}
            className={cn(
              submitButton.className,
              'rounded-l-none dark:bg-box-brighter'
            )}
            onClick={submitButton.onClick}
          >
            {submitButton.isLoading ? '' : submitButton.text || 'Send'}
          </Button>
        )}

        {type === 'password' && (
          <>
            {eyeOff ? (
              <EyeOff
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                onClick={() => setEye(false)}
              />
            ) : (
              <Eye
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                onClick={() => setEye(true)}
              />
            )}
          </>
        )}

        {clearable && internalValue && (
          <CircleX
            className="text-gray-600 absolute left-1 top-1/2 transform -translate-y-1/2 cursor-pointer"
            onClick={handleClear}
          />
        )}
      </div>

      <FormDescription
        hint={hint}
        error={
          errorMessage ||
          (required && internalValue === '' ? undefined : formField.error)
        }
      />
    </div>
  );
};

export const Input = forwardRef(InputComponent);
Input.displayName = 'Input';
