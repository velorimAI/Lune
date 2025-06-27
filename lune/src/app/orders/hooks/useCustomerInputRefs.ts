import { useRef } from "react";

export type InputRefHandle = {
  clear: () => void;
};

export const useCustomerInputRefs = () => {
  const customerNameRef = useRef<InputRefHandle>(null);
  const phoneNumberRef = useRef<InputRefHandle>(null);
  const receptionNumberRef = useRef<InputRefHandle>(null);
  const receptionDateRef = useRef<InputRefHandle>(null);

  const clearAllFields = () => {
    customerNameRef.current?.clear();
    phoneNumberRef.current?.clear();
    receptionNumberRef.current?.clear();
    receptionDateRef.current?.clear();
  };

  return {
    refs: {
      customerNameRef,
      phoneNumberRef,
      receptionNumberRef,
      receptionDateRef,
    },
    clearAllFields,
  };
};
