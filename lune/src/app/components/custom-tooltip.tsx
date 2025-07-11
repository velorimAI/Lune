"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { InfoIcon } from "lucide-react";

interface ToolTipProps {
  hint?: string | ReactNode;
  className?: string;
  tooltipTriggerIcon?: any;
  style?: any;
  children?: React.ReactNode;
  hintClassName?: string;
}

function ToolTip(props: ToolTipProps) {
  const { hint, className, tooltipTriggerIcon, style, children , hintClassName } = props;

  return (
    <TooltipProvider>
      <Tooltip delayDuration={150}>
        <TooltipTrigger asChild>
          {children ? (
            <div style={style} className={cn("cursor-pointer", className)}>
              {children}
            </div>
          ) : tooltipTriggerIcon ? (
            tooltipTriggerIcon
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
            "dark:bg-white/90 dark:text-black", hintClassName
          )}
        >
          {hint || ""}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default ToolTip;
