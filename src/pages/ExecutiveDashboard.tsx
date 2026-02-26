import {
  BarChart3,
  CheckCircle2,
  Clock,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  ClipboardList,
  CalendarClock,
  Percent,
  Star,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatCurrency, getStatusColor } from "@/lib/mock-data";
import {
  useProjects,
  useDashboardStats,
  useDepartments,
} from "@/hooks/use-projects";
import { useRole } from "@/hooks/use-role";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

// ─── shared palette ─────────────────────────────────────────
const PIE_COLORS = [
  "hsl(152, 60%, 40%)",
  "hsl(205, 80%, 50%)",
  "hsl(38, 92%, 50%)",
  "hsl(215, 14%, 65%)",
  "hsl(0, 72%, 51%)",
];

const monthlyBudgetData = [
  { month: "Jul", budget: 380, expenditure: 210 },
  { month: "Aug", budget: 420, expenditure: 250 },
  { month: "Sep", budget: 460, expenditure: 290 },
  { month: "Oct", budget: 510, expenditure: 340 },
  { month: "Nov", budget: 540, expenditure: 380 },
  { month: "Dec", budget: 580, expenditure: 420 },
  { month: "Jan", budget: 620, expenditure: 460 },
  { month: "Feb", budget: 650, expenditure: 490 },
];

// ─── reusable pieces ────────────────────────────────────────
const KpiCard = ({
  icon: Icon,
  label,
  value,
  change,
  changeType,
  accent = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  change?: string;
  changeType?: "up" | "down";
  accent?: boolean;
}) => (
  <div
    className={`rounded-xl border p-5 card-shadow animate-fade-in ${accent ? "bg-primary text-primary-foreground" : "bg-card"}`}
  >
    <div className="flex items-center justify-between mb-3">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-lg ${accent ? "bg-white/20" : "bg-primary/10"}`}
      >
        <Icon className={`h-5 w-5 ${accent ? "text-white" : "text-primary"}`} />
      </div>
      {change && (
        <span
          className={`text-xs font-medium ${changeType === "up" ? "text-emerald-500" : "text-red-500"}`}
        >
          {changeType === "up" ? "↑" : "↓"} {change}
        </span>
      )}
    </div>
    <p
      className={`text-2xl font-bold font-display ${accent ? "text-white" : "text-foreground"}`}
    >
      {value}
    </p>
    <p
      className={`text-xs mt-1 ${accent ? "text-white/70" : "text-muted-foreground"}`}
    >
      {label}
    </p>
  </div>
);

// ─── ROLE BADGE ────────────────────────────────────────────
const ROLE_BADGE = {
  executive: "bg-purple-100 text-purple-700 border-purple-200",
  admin: "bg-red-100 text-red-700 border-red-200",
  staff: "bg-blue-100 text-blue-700 border-blue-200",
};

// ═══════════════════════════════════════════════════════════
// EXECUTIVE / ADMIN VIEW  — full strategic overview
// ═══════════════════════════════════════════════════════════
function ExecutiveView() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: departments } = useDepartments();

  if (statsLoading || projectsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-72 rounded-xl" />
      </div>
    );
  }

  const recentProjects = projects?.slice(0, 5) ?? [];
  const budgetUtilization = stats
    ? Math.round((stats.totalExpenditure / stats.totalBudget) * 100) || 0
    : 0;
  const statusCounts = stats?.statusCounts ?? [];
  const flagshipProjects = projects?.filter((p) => p.is_flagship) ?? [];

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          icon={BarChart3}
          label="Total Projects"
          value={stats?.totalProjects.toString() ?? "0"}
        />
        <KpiCard
          icon={CheckCircle2}
          label="Completed"
          value={stats?.completedProjects.toString() ?? "0"}
          change={`${stats?.completionRate ?? 0}%`}
          changeType="up"
        />
        <KpiCard
          icon={DollarSign}
          label="Total Budget"
          value={formatCurrency(stats?.totalBudget ?? 0)}
          accent
        />
        <KpiCard
          icon={TrendingUp}
          label="Budget Utilization"
          value={`${budgetUtilization}%`}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border bg-card p-5 card-shadow">
          <h3 className="mb-4 font-semibold text-foreground">
            Budget vs Expenditure (KES Millions)
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlyBudgetData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,20%,88%)" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "hsl(215,14%,46%)" }}
              />
              <YAxis tick={{ fontSize: 12, fill: "hsl(215,14%,46%)" }} />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid hsl(214,20%,88%)",
                  fontSize: "12px",
                }}
              />
              <Bar
                dataKey="budget"
                fill="hsl(215,60%,22%)"
                radius={[4, 4, 0, 0]}
                name="Budget"
              />
              <Bar
                dataKey="expenditure"
                fill="hsl(174,42%,40%)"
                radius={[4, 4, 0, 0]}
                name="Expenditure"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border bg-card p-5 card-shadow">
          <h3 className="mb-4 font-semibold text-foreground">Project Status</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={statusCounts}
                dataKey="count"
                nameKey="label"
                cx="50%"
                cy="50%"
                outerRadius={78}
                innerRadius={42}
              >
                {statusCounts.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid hsl(214,20%,88%)",
                  fontSize: "12px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1.5">
            {statusCounts.map((s, i) => (
              <div
                key={s.status}
                className="flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: PIE_COLORS[i] }}
                  />
                  <span className="text-muted-foreground">{s.label}</span>
                </div>
                <span className="font-medium text-foreground">{s.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent projects */}
        <div className="rounded-xl border bg-card p-5 card-shadow">
          <h3 className="mb-4 font-semibold text-foreground">
            Recent Projects
          </h3>
          <div className="space-y-2.5">
            {recentProjects.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-lg border p-3 gap-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">
                    {p.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Progress
                      value={p.completion_percentage}
                      className="h-1 flex-1"
                    />
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      {p.completion_percentage}%
                    </span>
                  </div>
                </div>
                <Badge
                  className={
                    getStatusColor(p.status) +
                    " text-[10px] capitalize shrink-0"
                  }
                >
                  {p.status.replace("_", " ")}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Flagship projects */}
        <div className="rounded-xl border bg-card p-5 card-shadow">
          <h3 className="mb-4 font-semibold text-foreground flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" /> Flagship Projects
          </h3>
          {flagshipProjects.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">
              No flagship projects marked.
            </p>
          ) : (
            <div className="space-y-2.5">
              {flagshipProjects.slice(0, 5).map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {p.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(p as any).departments?.name ?? "—"}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-foreground shrink-0 ml-3">
                    {formatCurrency(Number(p.budget_allocation))}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Departments summary */}
      {(departments?.length ?? 0) > 0 && (
        <div className="rounded-xl border bg-card p-5 card-shadow">
          <h3 className="mb-4 font-semibold text-foreground">Departments</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {departments!.map((d) => (
              <div key={d.id} className="rounded-lg border px-4 py-3">
                <p className="text-sm font-medium text-foreground">{d.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {d.description ?? "County department"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Attention banner */}
      {projects?.some((p) => p.status === "on_hold") && (
        <div className="rounded-xl border border-warning/30 bg-warning/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <h3 className="font-semibold text-sm text-foreground">
              Attention Required
            </h3>
          </div>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {projects
              .filter((p) => p.status === "on_hold")
              .map((p) => (
                <li key={p.id}>
                  • <strong>{p.title}</strong> — Project on hold
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// STAFF VIEW  — task-focused, no financial details
// ═══════════════════════════════════════════════════════════
function StaffView() {
  const { data: projects, isLoading } = useProjects();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-72 rounded-xl" />
      </div>
    );
  }

  const myProjects = projects ?? [];
  const ongoing = myProjects.filter((p) => p.status === "ongoing");
  const planning = myProjects.filter((p) => p.status === "planning");
  const completed = myProjects.filter((p) => p.status === "completed");
  const onHold = myProjects.filter((p) => p.status === "on_hold");

  const avgCompletion = myProjects.length
    ? Math.round(
        myProjects.reduce((s, p) => s + p.completion_percentage, 0) /
          myProjects.length,
      )
    : 0;

  return (
    <div className="space-y-6">
      {/* Summary KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          icon={ClipboardList}
          label="Assigned Projects"
          value={String(myProjects.length)}
        />
        <KpiCard
          icon={CalendarClock}
          label="Ongoing"
          value={String(ongoing.length)}
          accent
        />
        <KpiCard
          icon={CheckCircle2}
          label="Completed"
          value={String(completed.length)}
          change={`${completed.length > 0 ? Math.round((completed.length / myProjects.length) * 100) : 0}%`}
          changeType="up"
        />
        <KpiCard
          icon={Percent}
          label="Avg. Completion"
          value={`${avgCompletion}%`}
        />
      </div>

      {/* Active projects list */}
      <div className="rounded-xl border bg-card p-5 card-shadow">
        <h3 className="mb-4 font-semibold text-foreground flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" /> Active Projects
        </h3>
        {ongoing.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">
            No ongoing projects at the moment.
          </p>
        ) : (
          <div className="space-y-3">
            {ongoing.map((p) => (
              <div
                key={p.id}
                className="rounded-lg border p-4 hover:bg-muted/20 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="font-medium text-foreground">{p.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {(p as any).departments?.name ?? "—"} ·{" "}
                      {p.ward ?? p.subcounty ?? p.county}
                    </p>
                  </div>
                  <Badge
                    className={
                      getStatusColor(p.status) +
                      " text-[10px] capitalize shrink-0"
                    }
                  >
                    {p.status.replace("_", " ")}
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <Progress
                    value={p.completion_percentage}
                    className="h-2 flex-1"
                  />
                  <span className="text-xs font-semibold text-foreground w-10 text-right">
                    {p.completion_percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Planning + On-hold row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-5 card-shadow">
          <h3 className="mb-4 font-semibold text-foreground">In Planning</h3>
          {planning.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No projects in planning.
            </p>
          ) : (
            <div className="space-y-2">
              {planning.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <p className="text-sm font-medium text-foreground truncate flex-1 mr-3">
                    {p.title}
                  </p>
                  <Badge
                    className={
                      getStatusColor(p.status) +
                      " text-[10px] capitalize shrink-0"
                    }
                  >
                    {p.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border bg-card p-5 card-shadow">
          <h3 className="mb-4 font-semibold text-foreground flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-orange-500" /> On Hold
          </h3>
          {onHold.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No projects on hold.
            </p>
          ) : (
            <div className="space-y-2">
              {onHold.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-lg border border-orange-200 bg-orange-50 dark:bg-orange-900/10 p-3"
                >
                  <p className="text-sm font-medium text-foreground truncate flex-1 mr-3">
                    {p.title}
                  </p>
                  <Badge className="bg-orange-100 text-orange-700 border-orange-200 text-[10px] shrink-0">
                    On Hold
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// ROOT — switches view based on role
// ═══════════════════════════════════════════════════════════
const ExecutiveDashboard = () => {
  const { role, isLoading, isExecutiveOrAdmin } = useRole();

  const roleMeta: Record<string, { label: string; class: string }> = {
    executive: {
      label: "Executive",
      class: "bg-purple-100 text-purple-700 border-purple-200",
    },
    admin: {
      label: "Administrator",
      class: "bg-red-100 text-red-700 border-red-200",
    },
    staff: {
      label: "Staff",
      class: "bg-blue-100 text-blue-700 border-blue-200",
    },
  };
  const meta = role ? roleMeta[role] : null;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground leading-none">
            {isExecutiveOrAdmin ? "Executive Dashboard" : "My Dashboard"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isExecutiveOrAdmin
              ? "Strategic overview of county project performance and financials"
              : "Your assigned projects, progress, and action items"}
          </p>
        </div>
        {!isLoading && meta && (
          <span
            className={`border rounded-full px-3 py-1 text-xs font-medium shrink-0 ${meta.class}`}
          >
            {meta.label} View
          </span>
        )}
      </div>

      {/* Role-differentiated content */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : isExecutiveOrAdmin ? (
        <ExecutiveView />
      ) : (
        <StaffView />
      )}
    </div>
  );
};

export default ExecutiveDashboard;
