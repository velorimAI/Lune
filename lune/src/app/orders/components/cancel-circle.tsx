import { useRef, useState } from "react";
import { X } from "lucide-react";
import clsx from "clsx";

interface CancelCircleProps {
  onCancel: () => void;
  duration?: number;
}

export const CancelCircle = ({
  onCancel,
  duration = 1000,
}: CancelCircleProps) => {
  const [progress, setProgress] = useState(0);
  const [cancelled, setCancelled] = useState(false);
  const [isFired, setIsFired] = useState(false); // 🔹 فقط یک بار اجرا شود
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
        onCancel();
        setCancelled(true);
        setIsFired(true); 
      }
      resetTimers();
    }, duration);
  };

  const reset = () => {
    setProgress(0);
    setCancelled(false);
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
        cancelled ? "bg-red-500" : "bg-white"
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
          stroke={cancelled ? "#ef4444" : "#000"}
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
      <X
        className={clsx(
          "w-3.5 h-3.5 z-10 drop-shadow-sm",
          cancelled ? "text-white" : "text-black"
        )}
      />
    </div>
  );
};
