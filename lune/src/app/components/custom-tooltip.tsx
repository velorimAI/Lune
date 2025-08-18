
"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/app/utils/cn";
import { ReactNode, CSSProperties } from "react";
import { InfoIcon } from "lucide-react";
import { getCancelMessage, getConfirmMessage } from "../utils/statusUtils";

interface ToolTipProps {
  hint?: string | ReactNode;
  className?: string;
  tooltipTriggerIcon?: ReactNode;
  style?: CSSProperties;
  children?: ReactNode;
  hintClassName?: string;
  status?: string;
  actionType?: "confirm" | "cancel";
}

export default function ToolTip({
  hint,
  className,
  tooltipTriggerIcon,
  style,
  children,
  hintClassName,
  status,
  actionType,
}: ToolTipProps) {
  let computedHint: ReactNode = hint ?? "";
  if (!hint && status && actionType) {
    computedHint =
      actionType === "confirm"
        ? getConfirmMessage(status)
        : getCancelMessage(status);
  }

  return (
    <TooltipProvider>
      <Tooltip delayDuration={150}>
        <TooltipTrigger asChild>
          {children ? (
            <div style={style} className={cn("cursor-pointer", className)}>
              {children}
            </div>
          ) : tooltipTriggerIcon ? (
            <div style={style} className={cn("cursor-pointer", className)}>
              {tooltipTriggerIcon}
            </div>
          ) : (
            <InfoIcon
              onClick={(e) => e.stopPropagation()}
              size={14}
              className={cn("text-muted-foreground cursor-pointer", className)}
              style={style}
            />
          )}
        </TooltipTrigger>
        <TooltipContent
          side="top"
          align="center"
          sideOffset={6}
          className={cn(
            "z-50 rounded-md bg-black text-white px-3 py-2 text-xs",
            "shadow-lg backdrop-blur-sm",
            "dark:bg-white/90 dark:text-black",
            hintClassName
          )}
        >
          {computedHint}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
