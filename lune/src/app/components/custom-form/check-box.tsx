import { FC, ReactNode } from "react";

import { cn } from "@/app/utils/cn";
import { Checkbox } from "@/components/ui/checkbox";
import { useFormField } from "@/app/hooks/form/useFormField";
import { FormLabel } from "./form-label";

type InputProps = {
  checked?: boolean;
  className?: string;
  disabled?: boolean;
  label?: string;
  name?: string;
  onChange?: (checked: boolean) => void;
  inline?: boolean;
  reverse?: boolean;
  tooltip?: string | ReactNode;
  tooltipTriggerIcon?: any;
};

export const CheckBox: FC<InputProps> = (props) => {
  const {
    name,
    label,
    className,
    checked = false,
    onChange,
    disabled,
    inline = true,
    reverse,
    tooltipTriggerIcon,
    tooltip,
  } = props;

  const formField = useFormField({
    name,
    initialValue: checked,
    type: "boolean",
  });

  const handleChange = (flag: boolean) => {
    formField.setValueState(flag);
    onChange?.(flag);
  };

  return (
    <div
      className={cn(
        `
        ${reverse ? "flex-row" : "flex-row-reverse"}
        ${
          inline
            ? "flex justify-start items-center gap-2"
            : "flex flex-col justify-start items-start gap-2"
        }
        `,
        className
      )}
    >
      <FormLabel
        label={label}
        tooltipTriggerIcon={tooltipTriggerIcon}
        tooltip={tooltip}
      />
      <Checkbox
        {...formField.fieldRegister}
        disabled={disabled}
        checked={formField.valueState}
        onCheckedChange={handleChange}
      />
    </div>
  );
};
