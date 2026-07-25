"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import type { User } from "@/types";

import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";

import { useAuth } from "@/context/auth-context";

interface NavUserProps {
  user: User;
}

export function NavUser({ user }: NavUserProps) {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const initials = user.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <SidebarFooter>
      <SidebarSeparator />

      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton disabled className="h-14 cursor-default">
            {user.profilePicture ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={user.profilePicture}
                  alt={user.name}
                  className="h-9 w-9 rounded-full object-cover"
                />
              </>
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {initials}
              </div>
            )}

            <div className="flex min-w-0 flex-col text-left">
              <span className="truncate text-sm font-medium">
                {user.name}
              </span>

              <span className="truncate text-xs text-muted-foreground">
                {user.email}
              </span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={handleLogout}
            className="cursor-pointer text-destructive hover:text-destructive"
          >
            <LogOut className="size-4" />
            <span>Logout</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}