'use client';

import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu as DropdownMenuShadcn,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';

type itemType = {
  title?: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  href?: string;
  render?: () => ReactNode;
  hidden?: boolean;
  icon?: ReactNode;
};

type DropDownMenuProps = {
  trigger?: ReactNode;
  items?: itemType[];
  label?: ReactNode;
};

export const DropDownMenu = (props: DropDownMenuProps) => {
  const {
    trigger = <Button variant="outline">Open</Button>,
    label,
    items,
  } = props;

  const router = useRouter();

  const itemsLength = items?.length || 0;

  const handleStopPropagation = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
  };

  return (
    <DropdownMenuShadcn>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        {trigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 dark:bg-box-darker dark:shadow-black dark:shadow-sm dark:border-none">
        {label && (
          <>
            <DropdownMenuLabel>{label}</DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}
        {items?.map((item, index) => {
          if (Object.keys(item).length === 0 || item.hidden) return null;
          return (
            <div key={index} onClick={handleStopPropagation}>
              <DropdownMenuItem
                className="cursor-pointer dark:text-zinc-400 dark:hover:text-zinc-300 dark:hover:bg-box-brighter"
                disabled={item.disabled}
                onClick={(e) => {
                  e.stopPropagation();
                  if (item?.href) router.push(item.href);
                  item?.onClick?.();
                }}
              >
                {item.icon && <span className="w-4 h-4">{item.icon}</span>}
                {item?.title}
                {item?.render?.()}
              </DropdownMenuItem>
              {index !== itemsLength - 1 && (
                <DropdownMenuSeparator className="dark:opacity-40" />
              )}
            </div>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenuShadcn>
  );
};