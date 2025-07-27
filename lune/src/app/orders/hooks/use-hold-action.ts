import { useRef, useEffect, useState } from 'react';

export const useHoldAction = (onHold: () => void, delay = 1500) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startHold = () => {
    if (isHolding || isCompleted) return;
    const start = Date.now();

    setIsHolding(true);
    setProgress(0);
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min((elapsed / delay) * 100, 100);
      setProgress(pct);
    }, 16);

    timerRef.current = setTimeout(() => {
      onHold();
      setIsCompleted(true);
      setIsHolding(false);
      clearInterval(intervalRef.current!);
      setTimeout(() => {
        setProgress(0);
        setIsCompleted(false);
      }, 2000);
    }, delay);
  };

  const cancelHold = () => {
    clearTimeout(timerRef.current!);
    clearInterval(intervalRef.current!);
    setProgress(0);
    setIsHolding(false);
  };

  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current!);
      clearInterval(intervalRef.current!);
    };
  }, []);

  return {
    startHold,
    cancelHold,
    progress,
    isHolding,
    isCompleted,
  };
};
