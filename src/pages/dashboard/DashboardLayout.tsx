import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardTopbar } from "@/components/dashboard/DashboardTopbar";
import { Toaster } from "@/components/ui/sonner";

export default function DashboardLayout() {
  return (
    <div dir="ltr" className="contents">
      <SidebarProvider>
        <div dir="ltr" className="flex min-h-screen w-full bg-muted/30">
          <DashboardSidebar />
          <SidebarInset className="flex min-w-0 flex-1 flex-col">
            <DashboardTopbar />
            <main dir="ltr" className="flex-1 overflow-x-hidden p-4 md:p-6">
              <Outlet />
            </main>
          </SidebarInset>
        </div>
        <Toaster />
      </SidebarProvider>
    </div>
  );
}

