import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*, departments(name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useDepartments() {
  return useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("departments")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const { data: projects, error } = await supabase
        .from("projects")
        .select("status, budget_allocation, expenditure, completion_percentage");
      if (error) throw error;

      const totalProjects = projects.length;
      const completedProjects = projects.filter((p) => p.status === "completed").length;
      const ongoingProjects = projects.filter((p) => p.status === "ongoing").length;
      const planningProjects = projects.filter((p) => p.status === "planning").length;
      const totalBudget = projects.reduce((s, p) => s + Number(p.budget_allocation), 0);
      const totalExpenditure = projects.reduce((s, p) => s + Number(p.expenditure), 0);
      const completionRate = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 1000) / 10 : 0;

      const statusCounts = [
        { status: "completed", count: completedProjects, label: "Completed" },
        { status: "ongoing", count: ongoingProjects, label: "Ongoing" },
        { status: "planning", count: planningProjects, label: "Planning" },
        { status: "on_hold", count: projects.filter((p) => p.status === "on_hold").length, label: "On Hold" },
        { status: "cancelled", count: projects.filter((p) => p.status === "cancelled").length, label: "Cancelled" },
      ];

      return { totalProjects, completedProjects, ongoingProjects, planningProjects, totalBudget, totalExpenditure, completionRate, statusCounts };
    },
  });
}
