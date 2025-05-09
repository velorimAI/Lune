'use client';

import { ChevronRight, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useEffect, useState } from 'react';

type NavMainTypes = {
  icon?: LucideIcon;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
  title: string;
  url?: string;
};

export function NavMain({ items }: { items: NavMainTypes[] }) {
  const { state, toggleSidebar } = useSidebar();
  const pathname = usePathname();
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>(
    {}
  );
  useEffect(() => {
    setOpenSections(() => {
      const newState: { [key: string]: boolean } = {};
      items.forEach((item) => {
        const isActive =
          pathname === item.url ||
          item.items?.some(
            (subItem) =>
              subItem.url === pathname || pathname.includes(subItem.url)
          );
        if (isActive) newState[item.title] = true;
      });
      return newState;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleSection = (title: string) => {
    setOpenSections((prev) => {
      return { [title]: !prev[title] };
    });
    if (state === 'collapsed') {
      toggleSidebar();
    }
  };
  const renderSidebarMenuButton = (item: NavMainTypes, isOpen = false) => {
    const menu = (
      <SidebarMenuButton
        onClick={() => toggleSection(item.title)}
        tooltip={item.title}
        isActive={pathname === item.url}
        className={`text-base h-11 pl-4 text-darkGray data-[active=true]:bg-transparent data-[active=true]:hover:bg-sidebar-accent
           dark:data-[active=true]:bg-box-brighter data-[active=true]:text-secondaryBlue 
           dark:text-zinc-400
           dark:data-[active=true]:text-secondaryBlue dark:shadow-sm dark:hover:bg-box-brighter
          ${
            pathname === item.url || isOpen
              ? 'text-secondaryBlue'
              : 'text-darkGray'
          }
          ${item?.items && item?.items?.length >= 1 && openSections[item.title] && !isOpen && 'bg-sidebar-accent dark:bg-box-brighter'}
          `}
      >
        {item.icon && <item.icon style={{ width: '22px', height: '22px' }} />}
        <span className="max-lg:text-xs">{item.title}</span>
        {item?.items && item?.items?.length >= 1 && (
          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
        )}
      </SidebarMenuButton>
    );

    if (item.url) {
      return <Link href={item.url}>{menu}</Link>;
    }
    return menu;
  };

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const isActive =
            pathname === item.url ||
            item.items?.some(
              (subItem) =>
                subItem.url === pathname || pathname.includes(subItem.url)
            );
          return (
            <Collapsible
              asChild
              className="group/collapsible"
              defaultOpen={isActive}
              key={item.title}
              open={openSections[item.title] || false}
            >
              <SidebarMenuItem>
                {item?.items?.length ? (
                  <CollapsibleTrigger asChild>
                    {renderSidebarMenuButton(item, isActive)}
                  </CollapsibleTrigger>
                ) : (
                  renderSidebarMenuButton(item)
                )}
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          className="text-base dark:data-[active=true]:bg-box-brighter dark:text-zinc-400 dark:data-[active=true]:text-white h-11 dark:hover:bg-box-brighter"
                          asChild
                          isActive={pathname === subItem.url}
                        >
                          {subItem?.url && (
                            <Link href={subItem.url}>
                              <span className="max-lg:text-xs">
                                {subItem.title}
                              </span>
                            </Link>
                          )}
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
                {isActive && (
                  <div
                    className={`rounded-r-[3px] absolute z-50 -left-2 top-0 w-1 bg-secondaryBlue 
 ${state === 'expanded' ? 'h-11' : 'h-8'}`}
                  ></div>
                )}
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}