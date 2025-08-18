import { useRef } from "react";

export type InputRefHandle = {
  clear: () => void;
};

export const usePartInputRefs = () => {
  const partIdRef = useRef<InputRefHandle>(null);
  const pieceNameRef = useRef<InputRefHandle>(null);
  const numberOfPiecesRef = useRef<InputRefHandle>(null);
  const orderNumberRef = useRef<InputRefHandle>(null);
  const deliveryDateRef = useRef<InputRefHandle>(null); 

  const clearPartFields = () => {
    partIdRef.current?.clear();
    pieceNameRef.current?.clear();
    numberOfPiecesRef.current?.clear();
    orderNumberRef.current?.clear();
    deliveryDateRef.current?.clear(); 
  };

  
  

  return {
    refs: {
      partIdRef,
      pieceNameRef,
      numberOfPiecesRef,
      orderNumberRef,
      deliveryDateRef, 
    },
    clearPartFields,
  };
};
