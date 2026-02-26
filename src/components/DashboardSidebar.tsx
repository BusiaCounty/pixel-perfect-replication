import {
  Building2,
  LayoutDashboard,
  FolderKanban,
  BarChart3,
  MapPin,
  Users,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/contexts/AuthContext";
import { useRole } from "@/hooks/use-role";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";

const ROLE_PILL: Record<string, { label: string; cls: string }> = {
  admin: { label: "Admin", cls: "bg-red-100 text-red-600 border-red-200" },
  executive: {
    label: "Executive",
    cls: "bg-purple-100 text-purple-600 border-purple-200",
  },
  staff: { label: "Staff", cls: "bg-blue-100 text-blue-600 border-blue-200" },
};

export function DashboardSidebar() {
  const { profile, signOut } = useAuth();
  const { role, isAdmin, isExecutiveOrAdmin } = useRole();

  const rolePill = role ? ROLE_PILL[role] : null;
  const initials = profile?.full_name
    ? profile.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <Sidebar className="border-r-0">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
          <Building2 className="h-4 w-4 text-sidebar-primary-foreground" />
        </div>
        <span className="font-display font-bold text-sm text-sidebar-foreground">
          County PMTS
        </span>
      </div>

      {/* User identity strip */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-sidebar-border/50">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-sidebar-foreground truncate">
            {profile?.full_name ?? "User"}
          </p>
          {rolePill && (
            <span
              className={`inline-block mt-0.5 rounded-full border px-2 py-0 text-[10px] font-medium leading-4 ${rolePill.cls}`}
            >
              {rolePill.label}
            </span>
          )}
        </div>
      </div>

      <SidebarContent>
        {/* Main navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 text-[10px] uppercase tracking-wider">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Dashboard — label differs by role */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/dashboard"
                    end
                    className="text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>
                      {isExecutiveOrAdmin
                        ? "Executive Dashboard"
                        : "My Dashboard"}
                    </span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Projects — visible to all */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/dashboard/projects"
                    className="text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  >
                    <FolderKanban className="mr-2 h-4 w-4" />
                    <span>
                      {isExecutiveOrAdmin ? "All Projects" : "My Projects"}
                    </span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Departments — visible to all */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/dashboard/departments"
                    className="text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    <span>Departments</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Analytics — executive/admin only */}
              {isExecutiveOrAdmin && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to="/dashboard/analytics"
                      className="text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <BarChart3 className="mr-2 h-4 w-4" />
                      <span>Analytics</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              {/* Locations — visible to all */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/dashboard/locations"
                    className="text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    <span>Locations</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin section */}
        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-sidebar-foreground/50 text-[10px] uppercase tracking-wider">
              Administration
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to="/dashboard/admin"
                      className="text-red-500/80 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                      activeClassName="bg-red-50 text-red-600 font-medium dark:bg-red-900/20"
                    >
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      <span>Super Admin</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-sidebar-border p-3 space-y-1">
        <Link
          to="/"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-xs text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
        >
          <LogOut className="h-3.5 w-3.5" /> Back to Public Site
        </Link>
        <button
          onClick={() => signOut()}
          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="h-3.5 w-3.5" /> Sign Out
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
