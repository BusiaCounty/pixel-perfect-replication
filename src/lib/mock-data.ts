import { Project, Department, DashboardStats, StatusCount } from "./types";

export const departments: Department[] = [
  { id: 1, name: "Roads & Infrastructure", projectCount: 42, totalBudget: 1850000000, totalExpenditure: 920000000 },
  { id: 2, name: "Health Services", projectCount: 35, totalBudget: 1200000000, totalExpenditure: 680000000 },
  { id: 3, name: "Education", projectCount: 28, totalBudget: 900000000, totalExpenditure: 520000000 },
  { id: 4, name: "Water & Sanitation", projectCount: 22, totalBudget: 750000000, totalExpenditure: 380000000 },
  { id: 5, name: "Agriculture", projectCount: 18, totalBudget: 450000000, totalExpenditure: 210000000 },
  { id: 6, name: "Trade & Enterprise", projectCount: 12, totalBudget: 320000000, totalExpenditure: 150000000 },
];

export const projects: Project[] = [
  {
    id: 1, title: "Mombasa-Malindi Highway Upgrade", description: "Major road construction and upgrade project connecting key commercial hubs with modern dual carriageway.",
    projectType: "Infrastructure", department: "Roads & Infrastructure", county: "Mombasa", subcounty: "Kisauni", ward: "Mjambere",
    budgetAllocation: 450000000, expenditure: 280000000, status: "ongoing", startDate: "2024-03-15", expectedCompletionDate: "2026-09-30",
    createdBy: "John Mwangi", createdAt: "2024-01-10", completionPercentage: 62, isFlagship: true,
  },
  {
    id: 2, title: "County Level 5 Hospital Expansion", description: "Expansion of the county referral hospital with new ICU wing, maternity ward, and modern diagnostics center.",
    projectType: "Healthcare", department: "Health Services", county: "Mombasa", subcounty: "Mvita", ward: "Tudor",
    budgetAllocation: 320000000, expenditure: 95000000, status: "ongoing", startDate: "2025-01-05", expectedCompletionDate: "2027-06-30",
    createdBy: "Dr. Amina Hassan", createdAt: "2024-11-20", completionPercentage: 28, isFlagship: true,
  },
  {
    id: 3, title: "Borehole Drilling Programme - Phase 2", description: "Drilling of 50 community boreholes across arid and semi-arid subcounties to improve water access.",
    projectType: "Water Supply", department: "Water & Sanitation", county: "Mombasa", subcounty: "Likoni", ward: "Timbwani",
    budgetAllocation: 180000000, expenditure: 170000000, status: "completed", startDate: "2023-06-01", expectedCompletionDate: "2025-05-31",
    actualCompletionDate: "2025-04-15", createdBy: "Peter Ochieng", createdAt: "2023-04-15", completionPercentage: 100, isFlagship: false,
  },
  {
    id: 4, title: "Smart Classroom Initiative", description: "Equipping 200 primary schools with digital learning infrastructure including tablets, projectors, and internet connectivity.",
    projectType: "Education", department: "Education", county: "Mombasa", subcounty: "Changamwe", ward: "Kipevu",
    budgetAllocation: 95000000, expenditure: 42000000, status: "ongoing", startDate: "2025-02-01", expectedCompletionDate: "2026-12-31",
    createdBy: "Grace Wanjiku", createdAt: "2024-10-01", completionPercentage: 44, isFlagship: true,
  },
  {
    id: 5, title: "Agricultural Market Construction", description: "Construction of 5 modern market facilities with cold storage and digital weighing systems.",
    projectType: "Agriculture", department: "Agriculture", county: "Mombasa", subcounty: "Jomvu", ward: "Mikindani",
    budgetAllocation: 120000000, expenditure: 15000000, status: "planning", startDate: "2026-04-01", expectedCompletionDate: "2027-12-31",
    createdBy: "Samuel Kiprop", createdAt: "2025-12-05", completionPercentage: 5, isFlagship: false,
  },
  {
    id: 6, title: "Street Lighting Upgrade", description: "Installation of solar-powered LED street lights on all major roads in the county.",
    projectType: "Infrastructure", department: "Roads & Infrastructure", county: "Mombasa", subcounty: "Nyali", ward: "Frere Town",
    budgetAllocation: 75000000, expenditure: 72000000, status: "completed", startDate: "2024-01-10", expectedCompletionDate: "2025-06-30",
    actualCompletionDate: "2025-05-20", createdBy: "John Mwangi", createdAt: "2023-11-01", completionPercentage: 100, isFlagship: false,
  },
  {
    id: 7, title: "Youth Polytechnic Revitalization", description: "Renovation and equipment of 10 youth polytechnics with modern workshops and training materials.",
    projectType: "Education", department: "Education", county: "Mombasa", subcounty: "Kisauni", ward: "Bamburi",
    budgetAllocation: 85000000, expenditure: 0, status: "planning", startDate: "2026-07-01", expectedCompletionDate: "2027-06-30",
    createdBy: "Grace Wanjiku", createdAt: "2026-01-15", completionPercentage: 0, isFlagship: false,
  },
  {
    id: 8, title: "Community Health Units Setup", description: "Establishing 30 community health units across the county with trained health workers.",
    projectType: "Healthcare", department: "Health Services", county: "Mombasa", subcounty: "Changamwe", ward: "Port Reitz",
    budgetAllocation: 55000000, expenditure: 55000000, status: "completed", startDate: "2024-03-01", expectedCompletionDate: "2025-02-28",
    actualCompletionDate: "2025-01-30", createdBy: "Dr. Amina Hassan", createdAt: "2024-01-15", completionPercentage: 100, isFlagship: false,
  },
  {
    id: 9, title: "SME Digital Hub", description: "Development of a technology hub to support small and medium enterprises with digital tools and training.",
    projectType: "Trade", department: "Trade & Enterprise", county: "Mombasa", subcounty: "Mvita", ward: "Majengo",
    budgetAllocation: 65000000, expenditure: 30000000, status: "ongoing", startDate: "2025-06-01", expectedCompletionDate: "2026-11-30",
    createdBy: "Samuel Kiprop", createdAt: "2025-03-10", completionPercentage: 46, isFlagship: false,
  },
  {
    id: 10, title: "Sewerage Treatment Plant", description: "Construction of a modern sewerage treatment facility to serve 200,000 residents.",
    projectType: "Water Supply", department: "Water & Sanitation", county: "Mombasa", subcounty: "Likoni", ward: "Shika Adabu",
    budgetAllocation: 280000000, expenditure: 40000000, status: "on_hold", startDate: "2025-09-01", expectedCompletionDate: "2028-03-31",
    createdBy: "Peter Ochieng", createdAt: "2025-06-20", completionPercentage: 12, isFlagship: true,
  },
];

export const dashboardStats: DashboardStats = {
  totalProjects: 157,
  completedProjects: 45,
  ongoingProjects: 80,
  planningProjects: 22,
  totalBudget: 5470000000,
  totalExpenditure: 2860000000,
  completionRate: 28.7,
};

export const statusCounts: StatusCount[] = [
  { status: "completed", count: 45, label: "Completed" },
  { status: "ongoing", count: 80, label: "Ongoing" },
  { status: "planning", count: 22, label: "Planning" },
  { status: "on_hold", count: 7, label: "On Hold" },
  { status: "cancelled", count: 3, label: "Cancelled" },
];

export const monthlyBudgetData = [
  { month: "Jul", budget: 380, expenditure: 210 },
  { month: "Aug", budget: 420, expenditure: 250 },
  { month: "Sep", budget: 460, expenditure: 290 },
  { month: "Oct", budget: 510, expenditure: 340 },
  { month: "Nov", budget: 540, expenditure: 380 },
  { month: "Dec", budget: 580, expenditure: 420 },
  { month: "Jan", budget: 620, expenditure: 460 },
  { month: "Feb", budget: 650, expenditure: 490 },
];

export function formatCurrency(amount: number): string {
  if (amount >= 1_000_000_000) return `KES ${(amount / 1_000_000_000).toFixed(1)}B`;
  if (amount >= 1_000_000) return `KES ${(amount / 1_000_000).toFixed(0)}M`;
  if (amount >= 1_000) return `KES ${(amount / 1_000).toFixed(0)}K`;
  return `KES ${amount}`;
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "completed": return "bg-success text-success-foreground";
    case "ongoing": return "bg-info text-info-foreground";
    case "planning": return "bg-warning text-warning-foreground";
    case "on_hold": return "bg-muted text-muted-foreground";
    case "cancelled": return "bg-destructive text-destructive-foreground";
    default: return "bg-muted text-muted-foreground";
  }
}
