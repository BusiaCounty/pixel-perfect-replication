import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProjectsPage from "./pages/ProjectsPage";
import LoginPage from "./pages/LoginPage";
import DashboardLayout from "./pages/DashboardLayout";
import ExecutiveDashboard from "./pages/ExecutiveDashboard";
import StaffProjectsPage from "./pages/StaffProjectsPage";
import DepartmentsPage from "./pages/DepartmentsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import LocationsPage from "./pages/LocationsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<ExecutiveDashboard />} />
            <Route path="projects" element={<StaffProjectsPage />} />
            <Route path="departments" element={<DepartmentsPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="locations" element={<LocationsPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
