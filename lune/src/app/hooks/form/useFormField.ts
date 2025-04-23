import { useEffect, useState, useMemo } from 'react';
import { useFormContext, get } from 'react-hook-form';

type formFieldParams = {
  name?: string;
  initialValue?: any;
  validations?: any;
  type?: 'boolean';
};

export const useFormField = (params: formFieldParams) => {
  const { name, validations, initialValue, type } = params;

  const { register, formState, setValue, unregister } = useFormContext() || {};

  const [valueState, setValueState] = useState<any>(initialValue);

  useEffect(() => {
    let result = initialValue || '';
    if (type === 'boolean' && (result === '' || result === false)) {
      result = false;
    }
    setValueState(result);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValue]);

  useEffect(() => {
    if (setValue && name) {
      setValue(name, valueState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, valueState]);

  useEffect(() => {
    return () => {
      if (unregister && name) {
        unregister(name);
      }
    };
  }, [unregister, name]);

  const fieldRegister = useMemo(() => {
    if (register && name) {
      return register(name, validations);
    }

    return undefined;
  }, [register, name, validations]);

  const errorMessage = get(formState?.errors, name || '')?.message || '';

  return {
    fieldRegister,
    valueState,
    setValueState,
    error: errorMessage,
    setFormValue: setValue,
  };
};
