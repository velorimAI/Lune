import { ReactNode, ChangeEvent } from 'react';
import { Textarea as TextareaShadcn } from '@/components/ui/textarea';
import { useFormFieldValidations } from '@/app/hooks/form/useFormFieldValidations';
import { useFormField } from '@/app/hooks/form/useFormField';
import { FormLabel } from './form-label';
import { FormDescription } from './form-description';


type TextAreaProps = {
    className?: string;
    name?: string;
    placeholder?: string;
    label?: string;
    hint?: ReactNode;
    value?: string;
    onChange?: (value?: string) => void;
    required?: boolean;
    disabled?: boolean;
    tooltip?: string | ReactNode;
    tooltipTriggerIcon?: any;
};

export const TextArea = (props: TextAreaProps) => {
    const {
        className,
        name,
        label,
        hint,
        value = '',
        onChange,
        required,
        disabled,
        placeholder,
        tooltipTriggerIcon,
        tooltip,
    } = props;

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

    const handleChange = (event: ChangeEvent<{ value: string }>) => {
        const value = event?.target?.value;
        formField.setValueState(value);
        onChange?.(value);
    };

    return (
        <div className="min-h-[80px]">
            <FormLabel
                label={label}
                required={required}
                inValid={!!formField?.error}
                tooltipTriggerIcon={tooltipTriggerIcon}
                tooltip={tooltip}
                className=' mb-2'
                disabled={disabled}
            />
            <TextareaShadcn
                {...formField.fieldRegister}
                className={className}
                value={formField.valueState}
                onChange={handleChange}
                placeholder={placeholder}
                disabled={disabled}
            />
            <FormDescription hint={hint} error={formField?.error} />
        </div>
    );
};