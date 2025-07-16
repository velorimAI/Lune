'use client';
import { FC, ReactNode, useRef, useState, useEffect, useMemo } from 'react';

import {
  Select as SelectShadcn,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

import { FormDescription } from './form-description';
import { FormLabel } from './form-label';
import { useFormFieldValidations } from '@/app/hooks/form/useFormFieldValidations';
import { useFormField } from '@/app/hooks/form/useFormField';
import { Skeleton } from '@/components/ui/skeleton';

type SelectBoxProps = {
  className?: string;
  disabled?: boolean;
 
  hiddenSearch?: boolean;
  hint?: ReactNode;
  inline?: boolean;
  isLoading?: boolean;
  label?: string;
  inputStyle?: string;
  name?: string;
  onChange?: (value?: any) => void;
  options?: {
    value?: string;
    label: string;
    disabled?: boolean;
    items?: { value?: string; label: string; disabled?: boolean }[];
  }[];
  placeholder?: string;
  required?: boolean;
  value?: string;
  labelClassName?: string;
  tooltip?: string | ReactNode;
  tooltipTriggerIcon?: any;
};

export const Select: FC<SelectBoxProps> = (props) => {
  const {
    className,
    disabled,
    
    hiddenSearch = false,
    hint,
    inline = false,
    isLoading = false,
    inputStyle,
    label,
    name,
    onChange,
    options = [],
    placeholder,
    required,
    value = '',
    labelClassName,
    tooltipTriggerIcon,
    tooltip,
  } = props;

  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const fieldValidation = useFormFieldValidations({
    validations: {
      required,
    },
    label,
  });

  const formField = useFormField({
    name,
    validations: fieldValidation,
    initialValue: value,
  });

  const handleChange = (value?: string) => {
    formField.setValueState(value);
    onChange?.(value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue.toString());
  };

  const filterResults = useMemo(() => {
    const optionsResult = Array.isArray(options) ? options : [];

    const hasItems = optionsResult?.some((item) =>
      item.hasOwnProperty('items')
    );
    if (hasItems) {
      const result = optionsResult?.map((group) => ({
        ...group,
        items: (group?.items || []).filter((item) =>
          item.label.toLowerCase().includes(searchTerm.toLowerCase())
        ),
      }));
      return result?.some((item) => item?.items?.length > 0) ? result : [];
    } else {
      return optionsResult?.filter((item) =>
        item.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  }, [searchTerm, options]);
  const restoreFocus = () => {
    if (inputRef.current) {
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  };
 
  useEffect(() => {
    restoreFocus();
  }, [filterResults]);
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (inputRef?.current) {
        inputRef?.current?.focus?.();
      }
    }, 0);
    return () => timeout && clearTimeout(timeout);
  }, [searchTerm]);

  return (
    <div
      className={cn(
        `min-h-[80px] ${inline && 'flex w-full justify-start gap-3 items-center'}`,
        className
      )}
    >
      {label && (
        <FormLabel
          className={cn('mb-2', labelClassName)}
          label={label}
          required={required}
          inValid={!!formField?.error}
          tooltipTriggerIcon={tooltipTriggerIcon}
          tooltip={tooltip}
          disabled={disabled}
        />
      )}

      <SelectShadcn
        onOpenChange={(open: boolean) => {
          if (!open && searchTerm) {
            setSearchTerm('');
          }
          restoreFocus();
        }}
        onValueChange={handleChange}
        value={formField.valueState}
        disabled={disabled}
      >
        <SelectTrigger
          className={cn(
            inputStyle,
            'dark:bg-box-brighter dark:border-none dark:text-zinc-400'
          )}
          dir='rtl'
          {...formField.fieldRegister}
        >
          <SelectValue placeholder={formField.valueState || placeholder} />
        </SelectTrigger>

        <SelectContent
          className="dark:bg-box-brighter dark:border-none "
        
        dir='rtl'
        >
          {isLoading ? (
          
            <Skeleton />
          ) : (
            <>
              {!hiddenSearch && (
                <Input
                  ref={inputRef}
                  className="mb-2 mt-0 active:outline-none dark:bg-box-brighter dark:border-none focus-visible:ring-0 bg-white rounded-none border-t-0 border-b-0 border-l-0 border-r-0"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={handleSearchChange}
                 
                  style={{ position: 'sticky', top: 0, zIndex: 10 }}
                />
              )}
              {filterResults.length > 0 ? (
                filterResults.map((item) => {
                  if (item.hasOwnProperty('items')) {
                    if (item?.items?.length) {
                      return (
                        <SelectGroup key={item.label}>
                          <SelectLabel>{item.label}</SelectLabel>
                          {(item.items || []).map((child) => {
                            return (
                              <SelectItem
                                disabled={child?.disabled}
                                key={child.value}
                                value={child?.value || ''}
                                className="dark:text-zinc-400 dark:hover:bg-box-brighter cursor-pointer dark:hover:text-zinc-200"
                              >
                                {child.label}
                              </SelectItem>
                            );
                          })}
                        </SelectGroup>
                      );
                    }
                    return null;
                  } else {
                    return (
                      <SelectItem
                        disabled={item?.disabled}
                        key={item.value}
                        value={item?.value || ''}
                        className="dark:text-zinc-400 dark:hover:bg-box-brighter cursor-pointer dark:hover:text-zinc-200"
                      >
                        {item.label}
                      </SelectItem>
                    );
                  }
                })
              ) : (
                <div className="p-2 text-sm text-gray-500">
                  No options found
                </div>
              )}
            </>
          )}
        </SelectContent>
      </SelectShadcn>
      <FormDescription hint={hint} error={formField?.error} />
    </div>
  );
};
