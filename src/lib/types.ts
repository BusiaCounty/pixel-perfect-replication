export type ProjectStatus = "planning" | "ongoing" | "completed" | "on_hold" | "cancelled";
export type UserRole = "public" | "staff" | "executive";

export interface Project {
  id: number;
  title: string;
  description: string;
  projectType: string;
  department: string;
  county: string;
  subcounty: string;
  ward: string;
  budgetAllocation: number;
  expenditure: number;
  status: ProjectStatus;
  startDate: string;
  expectedCompletionDate: string;
  actualCompletionDate?: string;
  createdBy: string;
  createdAt: string;
  completionPercentage: number;
  isFlagship: boolean;
}

export interface Department {
  id: number;
  name: string;
  projectCount: number;
  totalBudget: number;
  totalExpenditure: number;
}

export interface DashboardStats {
  totalProjects: number;
  completedProjects: number;
  ongoingProjects: number;
  planningProjects: number;
  totalBudget: number;
  totalExpenditure: number;
  completionRate: number;
}

export interface StatusCount {
  status: ProjectStatus;
  count: number;
  label: string;
}
