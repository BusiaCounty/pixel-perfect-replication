import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type AppRole = "staff" | "executive" | "admin";

export function useRole() {
  const { user } = useAuth();

  const { data: role, isLoading } = useQuery<AppRole | null>({
    queryKey: ["user-role", user?.id],
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 min – role changes rarely
    queryFn: async () => {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user!.id)
        .maybeSingle();
      return (data?.role as AppRole) ?? null;
    },
  });

  return {
    role,
    isLoading,
    isStaff: role === "staff",
    isExecutive: role === "executive",
    isAdmin: role === "admin",
    /** True for executive OR admin (both can see financial/strategic data) */
    isExecutiveOrAdmin: role === "executive" || role === "admin",
    /** True when any role has loaded */
    hasRole: !!role,
  };
}
