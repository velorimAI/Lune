"use client";

import {
  ReactNode,
  useState,
  useEffect,
  useMemo,
  useRef,
  forwardRef,
  ForwardRefRenderFunction,
  useImperativeHandle,
} from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/app/utils/cn";
import { Check, ChevronDown } from "lucide-react";
import { FormLabel } from "./form-label";
import { FormDescription } from "./form-description";
import { useFormField } from "@/app/hooks/form/useFormField";
import { useFormFieldValidations } from "@/app/hooks/form/useFormFieldValidations";

export type SelectPopoverRefHandle = {
  clear: () => void;
};

type SelectPopoverProps = {
  className?: string;
  disabled?: boolean;
  hint?: ReactNode;
  inline?: boolean;
  label?: string;
  name?: string;
  onChange?: (value?: string) => void;
  options?: {
    value?: string;
    label: string;
    disabled?: boolean;
  }[];
  placeholder?: string;
  required?: boolean;
  value?: string;
  inputClassName?: string;
  tooltip?: string | ReactNode;
  tooltipTriggerIcon?: any;
  hiddenSearch?: boolean;
};

const SelectPopoverComponent: ForwardRefRenderFunction<
  SelectPopoverRefHandle,
  SelectPopoverProps
> = (props, ref) => {
  const {
    className,
    disabled,
    hint,
    inline = false,
    label,
    name,
    onChange,
    options = [],
    placeholder = "انتخاب کنید...",
    required,
    value = "",
    inputClassName,
    tooltipTriggerIcon,
    tooltip,
    hiddenSearch = false,
  } = props;

  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedValue, setSelectedValue] = useState(value);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

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

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, options]);

  const selectedOption = useMemo(() => {
    return options.find((option) => option.value === selectedValue);
  }, [selectedValue, options]);

  const handleSelect = (optionValue?: string) => {
    setSelectedValue(optionValue || "");
    formField.setValueState(optionValue || "");
    onChange?.(optionValue);
    setOpen(false);
    setSearchTerm("");
  };

  const handleClear = () => {
    setSelectedValue("");
    formField.setValueState("");
    onChange?.("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case "Enter":
        e.preventDefault();
        if (filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex].value);
        }
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        break;
    }
  };

  useImperativeHandle(ref, () => ({
    clear: handleClear,
  }));

  useEffect(() => {
    if (value !== selectedValue) {
      setSelectedValue(value || "");
    }
  }, [value]);

  useEffect(() => {
    if (open) {
      // همیشه سرچ را پاک کن وقتی باز می‌شود
      setSearchTerm("");
      // فوکوس را بلافاصله به input سرچ بده
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 10);
    }
  }, [open]);

  useEffect(() => {
    setHighlightedIndex(0);
  }, [searchTerm]);

  useEffect(() => {
    // Scroll highlighted item into view
    if (listRef.current && filteredOptions.length > 0) {
      const highlightedElement = listRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [highlightedIndex, filteredOptions.length]);

  return (
    <div
      className={cn(
        `min-h-[80px] ${
          inline && "flex w-full justify-start gap-3 items-center"
        }`,
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

      <div className="w-full">
        <Popover open={open} onOpenChange={setOpen} modal={false}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className={cn(
                "w-full justify-between text-right",
                !selectedValue && "text-muted-foreground",
                inputClassName
              )}
              disabled={disabled}
              onKeyDown={handleKeyDown}
              {...formField.fieldRegister}
            >
              <span className="truncate">
                {selectedOption ? selectedOption.label : placeholder}
              </span>
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            className="w-[--radix-popover-trigger-width] p-0" 
            align="start"
            sideOffset={4}
            onOpenAutoFocus={(e) => {
              e.preventDefault();
              searchInputRef.current?.focus();
            }}
          >
            <div className="flex flex-col max-h-[300px]">
              {!hiddenSearch && (
                <div className="p-2 border-b">
                  <Input
                    ref={searchInputRef}
                    placeholder="جستجو..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-8"
                    onKeyDown={handleKeyDown}
                  />
                </div>
              )}
              
              <div 
                ref={listRef}
                className="overflow-auto p-1" 
                style={{ maxHeight: hiddenSearch ? "300px" : "250px" }}
              >
                {filteredOptions.length === 0 ? (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    نتیجه‌ای یافت نشد
                  </div>
                ) : (
                  filteredOptions.map((option, index) => (
                    <div
                      key={option.value}
                      className={cn(
                        "flex items-center px-2 py-1.5 text-sm rounded-md cursor-pointer transition-all duration-150",
                        "hover:bg-primary/10 hover:text-primary",
                        option.disabled && "opacity-50 cursor-not-allowed hover:bg-transparent",
                        selectedValue === option.value && "bg-primary text-primary-foreground font-medium",
                        highlightedIndex === index && selectedValue !== option.value && "bg-primary/10 text-black"
                      )}
                      onClick={() => {
                        if (!option.disabled) {
                          handleSelect(option.value);
                        }
                      }}
                      onMouseEnter={() => setHighlightedIndex(index)}
                    >
                      <span className="flex-1 text-right">{option.label}</span>
                      {selectedValue === option.value && (
                        <Check className="h-4 w-4 ml-2 text-primary-foreground" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <FormDescription
        hint={hint}
        error={required && selectedValue === "" ? undefined : formField.error}
      />
    </div>
  );
};

export const SelectPopover = forwardRef(SelectPopoverComponent);
SelectPopover.displayName = "SelectPopover";