"use client"

import { IconCirclePlusFilled, IconMail, type Icon } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useRouter, usePathname } from "next/navigation"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
  }[]
}) {
  const router = useRouter();
  const pathname = usePathname();

  const handleQuickCreate = () => {
    router.push(`/quiz/create`);
  };

  const handleInboxClick = () => {
    // Logic for inbox action
    router.push(`/inbox`);
  };

  const handleItemClick = (url: string) => {
    // Navigate to the specified URL
    router.push(url);
  };
  
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton onClick={handleQuickCreate}
              tooltip="Quick Create"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear cursor-pointer"
            >
              <IconCirclePlusFilled />
              <span>Quick Create</span>
            </SidebarMenuButton>
            <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0 cursor-pointer"
              variant="outline"
                onClick={handleInboxClick}
            >
              <IconMail />
              <span className="sr-only">Inbox</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => {
            const isHome = item.title === "Home";
            const isActive = isHome
                ? pathname === "/"
                : pathname.includes(item.url);

            return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                      tooltip={item.title}
                      className={`cursor-pointer ${
                          isActive
                              ? "bg-secondary text-secondary-foreground"
                              : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground active:bg-secondary/90 active:text-secondary-foreground"
                      }`}
                      onClick={() => handleItemClick(item.url)}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
