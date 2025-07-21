"use client";

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Heart, MessageSquare, Info, Bot } from "lucide-react";
import React from "react";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menuItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/liked", label: "Liked Assets", icon: Heart },
    { href: "/chat", label: "Chat", icon: MessageSquare },
    { href: "/about", label: "About", icon: Info },
  ];

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <Bot className="w-8 h-8 text-accent" />
            <h1 className="font-headline text-2xl font-bold">NightHub</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    asChild
                    tooltip={item.label}
                  >
                    <React.Fragment>
                      <item.icon />
                      <span>{item.label}</span>
                    </React.Fragment>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex items-center h-14 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
          <div className="md:hidden">
            <SidebarTrigger />
          </div>
          <div className="flex-1">
             <h1 className="font-headline text-xl font-semibold hidden md:block">NightHub Assets</h1>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
