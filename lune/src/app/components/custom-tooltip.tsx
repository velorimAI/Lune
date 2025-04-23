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

interface ToolTopTypes {
  hint?: string | ReactNode;
  className?: string;
  tooltipTriggerIcon?: any;
  style?: any;
}
function ToolTip(props: ToolTopTypes) {
  const { hint, className, tooltipTriggerIcon, style } = props;
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          style={style}
          className={cn(
            !tooltipTriggerIcon &&
              // 'bg-neutral-800 dark:bg-neutral-200 rounded-full dark:text-black w-4 text-white text-xs',
              className
          )}
        >
          <div className={`text-muted-foreground`}>
            {tooltipTriggerIcon ? (
              tooltipTriggerIcon
            ) : (
              <InfoIcon
                onClick={(e) => e.stopPropagation()}
                size={14}
                className={`text-muted-foreground`}
              />
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="right"
          align="center"
          className="max-w-[550px] p-2 text-xs"
        >
          {hint || ""}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default ToolTip;
