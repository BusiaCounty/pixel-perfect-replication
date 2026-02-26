import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { useAuth } from "@/contexts/AuthContext";

const DashboardLayout = () => {
  const { profile } = useAuth();
  const initials = profile?.full_name
    ? profile.full_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-card/80 backdrop-blur-md px-6">
            <SidebarTrigger />
            <div className="flex-1" />
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground hidden sm:block">{profile?.full_name}</span>
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-xs font-semibold text-primary-foreground">
                {initials}
              </div>
            </div>
          </header>
          <main className="flex-1 p-6 bg-background">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
