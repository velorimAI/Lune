import * as React from 'react';
import { type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
    disabled?: boolean;
  }[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const pathname = usePathname();
  const { state } = useSidebar();

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem
              key={item.title}
              className={`${item.disabled ? 'cursor-not-allowed' : ''}`}
            >
              <SidebarMenuButton
                tooltip={item.title}
                asChild
                isActive={pathname === item.url}
                className={`text-base h-11 pl-4 text-darkGray data-[active=true]:bg-transparent data-[active=true]:hover:bg-sidebar-accent 
                  data-[active=true]:text-secondaryBlue dark:text-zinc-400 dark:data-[active=true]:text-secondaryBlue 
                  dark:data-[active=true]:bg-box-brighter
                   dark:shadow-sm dark:hover:bg-box-brighter
                `}
              >
                <Link
                  href={item.url}
                  aria-disabled={item.disabled}
                  className={`flex items-center gap-2 ${
                    item.disabled ? 'pointer-events-none text-gray-500 opacity-60' : ''
                  }`}
                  onClick={(e) => item?.disabled && e.preventDefault()}
                >
                  {item.icon && (
                    <item.icon style={{ width: '22px', height: '22px' }} />
                  )}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>

              {pathname === item.url && (
                <div
                  className={`rounded-r-[3px] absolute z-50 -left-2 top-0 w-1 bg-secondaryBlue 
                    ${state === 'expanded' ? 'h-11' : 'h-8'}`}
                ></div>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
