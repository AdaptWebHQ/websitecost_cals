"use client";

import type { User } from "@/types";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { SIDEBAR } from "./sidebar-data";

interface AppSidebarProps {
  user: User;
}

export default function AppSidebar({ user }: AppSidebarProps) {
  const navigation =
    user.role === "admin" || user.role === "super_admin"
      ? SIDEBAR.admin
      : SIDEBAR.public;

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader className="border-b">
        <div className="flex h-16 items-center gap-3 px-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
            AW
          </div>

          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold tracking-tight">
              AdaptWeb Console
            </span>

            <span className="text-xs text-muted-foreground">
              Executive Suite
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navigation} />
      </SidebarContent>

      <NavUser user={user} />

      <SidebarRail />
    </Sidebar>
  );
}