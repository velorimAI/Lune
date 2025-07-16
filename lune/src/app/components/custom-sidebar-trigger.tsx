import { useSidebar } from '@/components/ui/sidebar';
import { Button } from '../../components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
interface SidebarTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}
export function CustomSidebarTrigger({
  className,
  onClick,
  ...props
}: SidebarTriggerProps) {
  const { toggleSidebar, state } = useSidebar();

  return (
    <Button
      data-sidebar="trigger"
      variant="link"
      size="icon"
      className={cn(
        'h-6 w-6 dark:hover:bg-box-brighter dark:hover:text-zinc-200',
        className
      )}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      {state === 'expanded' ? (
        <ChevronRight className="dark:text-zinc-400" />
       
      ) : (
        <ChevronLeft className="dark:text-zinc-400" />
      )}
    </Button>
  );
}