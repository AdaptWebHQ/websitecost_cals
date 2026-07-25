import { redirect } from "next/navigation";

import { getServerUser } from "@/actions/auth";

import AppSidebar from "@/components/shared/sidebar";
import Header from "@/components/shared/header";

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getServerUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <SidebarProvider>
      <AppSidebar user={user} />

      <SidebarInset>
        <div className="flex h-screen flex-col overflow-hidden bg-background text-foreground font-sans">
          <Header />

          <main className="flex-1 overflow-y-auto bg-background p-4 md:p-8">
            <div className="mx-auto max-w-7xl space-y-6">
              {children}
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}