'use client';

import { useEffect, useState } from 'react';
import { toZonedTime } from 'date-fns-tz';
import { Button } from './button';
import { FormDescription } from './custom-form/form-description';
import { FormLabel } from './custom-form/form-label';

interface TimePickerProps {
  value?: string;
  onChange?: (time: string) => void;
  required?: boolean;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  hasNow?: boolean;
  timezone?: string;
  label?: string;
  name?: string;
  errorMessage?: string;
  tooltip?: string | React.ReactNode;
  tooltipTriggerIcon?: any;
  hint?: React.ReactNode;
}

export const TimePicker = ({
  value,
  onChange,
  required,
  isOpen: controlledIsOpen,
  onOpenChange,
  hasNow = false,
  timezone = 'Asia/Tehran',
  label,
  name,
  errorMessage,
  tooltip,
  tooltipTriggerIcon,
  hint
}: TimePickerProps) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState('00');
  const [selectedMinute, setSelectedMinute] = useState('00');

  useEffect(() => {
    if (value) {
      const [hour, minute] = value.split(':');
      setSelectedHour(hour || '00');
      setSelectedMinute(minute || '00');
    }
  }, [value]);

  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const handleOpenChange = (open: boolean) => {
    if (!isControlled) setInternalIsOpen(open);
    onOpenChange?.(open);
  };

  const hours: string[] = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, '0')
  );
  const minutes: string[] = Array.from({ length: 60 / 10 }, (_, i) =>
    (i * 10).toString().padStart(2, '0')
  );

  const updateTime = (hour: string, minute: string) => {
    const timeString = `${hour}:${minute}`;
    onChange?.(timeString);
  };

  const handleTimeSelection = (type: 'hour' | 'minute', value: string): void => {
    if (type === 'hour') {
      setSelectedHour(value);
      updateTime(value, selectedMinute);
    } else if (type === 'minute') {
      setSelectedMinute(value);
      updateTime(selectedHour, value);
    }
  };

  const setNowTime = (): void => {
    const now = toZonedTime(new Date(), timezone);
    const hour = now.getHours().toString().padStart(2, '0');
    const minute = now.getMinutes().toString().padStart(2, '0');

    setSelectedHour(hour);
    setSelectedMinute(minute);
    onChange?.(`${hour}:${minute}`);
  };

  const handleOK = (): void => {
    handleOpenChange(false);
    onChange?.(`${selectedHour}:${selectedMinute}`);
  };

  return (
    <div className="relative w-full">
      <div className="min-h-[80px] w-full">
        <FormLabel
          className="dark:text-zinc-400 mb-2"
          label={label}
          required={required}
          tooltip={tooltip}
          tooltipTriggerIcon={tooltipTriggerIcon}
        />

        <div
          className={`rounded-md border border-gray  flex items-center shadow-sm ${hasNow ? 'pl-3 justify-between' : 'px-3'} py-1 flex-1 cursor-pointer`}
          onClick={() => handleOpenChange(true)}
        >
          {selectedHour}:{selectedMinute}
          {hasNow && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setNowTime();
              }}
              size="sm"
              className="text-mainBlue p-2 hover:no-underline"
              variant="link"
            >
              now
            </Button>
          )}
        </div>

        <FormDescription
          hint={errorMessage ? undefined : hint}
          error={!!errorMessage}
        />

      </div>

      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute mt-1 w-full bg-white dark:bg-box-brighter border rounded-lg shadow-lg p-4 z-10"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="h-48 overflow-y-auto border rounded">
              {minutes.map((minute) => (
                <div
                  key={minute}
                  onClick={() => handleTimeSelection('minute', minute)}
                  className={`px-2 py-1 cursor-pointer text-center hover:bg-gray-100 dark:hover:bg-box-brighter dark:hover:text-zinc-200 ${selectedMinute === minute
                      ? 'bg-blue-100 dark:bg-defaultGraphColor dark:text-white'
                      : 'dark:text-zinc-400'
                    }`}
                >
                  {minute}
                </div>
              ))}
            </div>
            <div className="h-48 overflow-y-auto border rounded">
              {hours.map((hour) => (
                <div
                  key={hour}
                  onClick={() => handleTimeSelection('hour', hour)}
                  className={`px-2 py-1 cursor-pointer text-center hover:bg-gray-100 dark:hover:bg-box-brighter dark:hover:text-zinc-200 ${selectedHour === hour
                      ? 'bg-blue-100 dark:bg-defaultGraphColor dark:text-white'
                      : 'dark:text-zinc-400'
                    }`}
                >
                  {hour}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex justify-end space-x-2">
            <Button size="sm" variant="default" onClick={handleOK}>
              انتخاب
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
