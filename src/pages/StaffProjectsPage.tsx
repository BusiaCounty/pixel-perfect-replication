import { useState } from "react";
import { Search, Plus, MoreHorizontal, MapPin, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, getStatusColor } from "@/lib/mock-data";
import { Progress } from "@/components/ui/progress";
import { useProjects } from "@/hooks/use-projects";
import { useRole } from "@/hooks/use-role";
import { Skeleton } from "@/components/ui/skeleton";

const StaffProjectsPage = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { data: projects, isLoading } = useProjects();
  const { isExecutiveOrAdmin, isAdmin } = useRole();

  const filtered = (projects ?? []).filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">
            {isExecutiveOrAdmin ? "All Projects" : "My Projects"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isExecutiveOrAdmin
              ? "Full project register — view, filter, and manage"
              : "Projects assigned to your department — track and update progress"}
          </p>
        </div>
        {/* Staff can log updates; admin can add new projects via Super Admin */}
        {isAdmin && (
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" /> New Project
          </Button>
        )}
        {!isExecutiveOrAdmin && (
          <div className="flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
            <Lock className="h-3.5 w-3.5" /> Read-only — contact an admin to add
            projects
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="staff-project-search"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger
            id="staff-status-filter"
            className="w-full sm:w-[160px]"
          >
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="ongoing">Ongoing</SelectItem>
            <SelectItem value="planning">Planning</SelectItem>
            <SelectItem value="on_hold">On Hold</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-card card-shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead className="hidden md:table-cell">Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Progress</TableHead>
              {/* Budget column only for executive / admin */}
              {isExecutiveOrAdmin && (
                <TableHead className="text-right hidden lg:table-cell">
                  Budget
                </TableHead>
              )}
              {isExecutiveOrAdmin && (
                <TableHead className="text-right hidden xl:table-cell">
                  Expenditure
                </TableHead>
              )}
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p) => (
              <TableRow key={p.id} className="group">
                <TableCell>
                  <div>
                    <p className="font-medium text-foreground">{p.title}</p>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                      <MapPin className="h-3 w-3" />
                      {[p.ward, p.subcounty].filter(Boolean).join(", ") ||
                        p.county}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground hidden md:table-cell">
                  {(p as any).departments?.name ?? "—"}
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      getStatusColor(p.status) + " capitalize text-[10px]"
                    }
                  >
                    {p.status.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 min-w-[120px]">
                    <Progress
                      value={p.completion_percentage}
                      className="h-1.5 flex-1"
                    />
                    <span className="text-xs font-medium text-foreground w-8 text-right">
                      {p.completion_percentage}%
                    </span>
                  </div>
                </TableCell>
                {isExecutiveOrAdmin && (
                  <TableCell className="text-right text-sm font-medium text-foreground hidden lg:table-cell">
                    {formatCurrency(Number(p.budget_allocation))}
                  </TableCell>
                )}
                {isExecutiveOrAdmin && (
                  <TableCell className="text-right text-sm text-muted-foreground hidden xl:table-cell">
                    {formatCurrency(Number(p.expenditure))}
                  </TableCell>
                )}
                <TableCell>
                  <Button
                    id={`project-menu-${p.id}`}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            No projects found
          </div>
        )}
      </div>

      {/* Staff informational note */}
      {!isExecutiveOrAdmin && (
        <p className="text-xs text-muted-foreground text-center">
          Showing all projects. Budget and financial data are only visible to
          executive users.
        </p>
      )}
    </div>
  );
};

export default StaffProjectsPage;
