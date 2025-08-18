import { useRef, useState } from "react";
import { Check } from "lucide-react";
import clsx from "clsx";

interface ConfirmCircleProps {
  onConfirm: () => void;
  duration?: number;
}

export const ConfirmCircle = ({
  onConfirm,
  duration = 1000,
}: ConfirmCircleProps) => {
  const [progress, setProgress] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const [isFired, setIsFired] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const radius = 13;
  const stroke = 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  const startProgress = () => {
    if (isFired) return; 

    const start = Date.now();
    setIsFired(false);
    intervalRef.current = setInterval(() => {
      const percent = Math.min(((Date.now() - start) / duration) * 100, 100);
      setProgress(percent);
    }, 30);

    timeoutRef.current = setTimeout(() => {
      if (!isFired) {
        onConfirm();
        setConfirmed(true);
        setIsFired(true); 
      }
      resetTimers();
    }, duration);
  };

  const reset = () => {
    setProgress(0);
    setConfirmed(false);
    setIsFired(false);
    resetTimers();
  };

  const resetTimers = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  return (
    <div
      onMouseDown={startProgress}
      onMouseUp={reset}
      onMouseLeave={reset}
      className={clsx(
        "relative w-7 h-7 rounded-full cursor-pointer flex items-center justify-center",
        confirmed ? "bg-green-500" : "bg-white"
      )}
    >
      <svg
        className="absolute w-full h-full transform -rotate-90"
        viewBox="0 0 30 30"
      >
        <circle
          cx="15"
          cy="15"
          r={radius}
          stroke="#d1d5db"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx="15"
          cy="15"
          r={radius}
          stroke={confirmed ? "#22c55e" : "#000"}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 30ms linear",
          }}
        />
      </svg>
      <Check
        className={clsx(
          "w-3.5 h-3.5 z-10 drop-shadow-sm",
          confirmed ? "text-white" : "text-black"
        )}
      />
    </div>
  );
};
