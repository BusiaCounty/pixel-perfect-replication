import { BarChart3, CheckCircle2, Clock, TrendingUp, AlertTriangle, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, getStatusColor } from "@/lib/mock-data";
import { useProjects, useDashboardStats, useDepartments } from "@/hooks/use-projects";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

const KpiCard = ({ icon: Icon, label, value, change, changeType }: { icon: any; label: string; value: string; change?: string; changeType?: "up" | "down" }) => (
  <div className="rounded-xl border bg-card p-5 card-shadow animate-fade-in">
    <div className="flex items-center justify-between mb-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      {change && (
        <span className={`text-xs font-medium ${changeType === "up" ? "text-success" : "text-destructive"}`}>
          {changeType === "up" ? "↑" : "↓"} {change}
        </span>
      )}
    </div>
    <p className="text-2xl font-bold font-display text-foreground">{value}</p>
    <p className="text-xs text-muted-foreground mt-1">{label}</p>
  </div>
);

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

const ExecutiveDashboard = () => {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: departments } = useDepartments();

  if (statsLoading || projectsLoading) {
    return (
      <div className="space-y-6">
        <div><h1 className="text-2xl font-bold font-display text-foreground">Executive Dashboard</h1></div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
      </div>
    );
  }

  const recentProjects = projects?.slice(0, 5) ?? [];
  const budgetUtilization = stats ? Math.round((stats.totalExpenditure / stats.totalBudget) * 100) || 0 : 0;
  const statusCounts = stats?.statusCounts ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">Executive Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of county project performance and financials</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard icon={BarChart3} label="Total Projects" value={stats?.totalProjects.toString() ?? "0"} />
        <KpiCard icon={CheckCircle2} label="Completed Projects" value={stats?.completedProjects.toString() ?? "0"} />
        <KpiCard icon={DollarSign} label="Total Budget" value={formatCurrency(stats?.totalBudget ?? 0)} />
        <KpiCard icon={TrendingUp} label="Budget Utilization" value={`${budgetUtilization}%`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border bg-card p-5 card-shadow">
          <h3 className="mb-4 font-semibold text-foreground">Budget vs Expenditure (KES Millions)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyBudgetData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 88%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(215, 14%, 46%)" }} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(215, 14%, 46%)" }} />
              <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(214, 20%, 88%)", fontSize: "12px" }} />
              <Bar dataKey="budget" fill="hsl(215, 60%, 22%)" radius={[4, 4, 0, 0]} name="Budget" />
              <Bar dataKey="expenditure" fill="hsl(174, 42%, 40%)" radius={[4, 4, 0, 0]} name="Expenditure" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border bg-card p-5 card-shadow">
          <h3 className="mb-4 font-semibold text-foreground">Project Status</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={statusCounts} dataKey="count" nameKey="label" cx="50%" cy="50%" outerRadius={80} innerRadius={45}>
                {statusCounts.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(214, 20%, 88%)", fontSize: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-3 space-y-1.5">
            {statusCounts.map((s, i) => (
              <div key={s.status} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                  <span className="text-muted-foreground">{s.label}</span>
                </div>
                <span className="font-medium text-foreground">{s.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-5 card-shadow">
          <h3 className="mb-4 font-semibold text-foreground">Recent Projects</h3>
          <div className="space-y-3">
            {recentProjects.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-lg border p-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">{p.title}</p>
                  <p className="text-xs text-muted-foreground">{(p as any).departments?.name ?? "—"}</p>
                </div>
                <Badge className={getStatusColor(p.status) + " text-[10px] capitalize ml-3 shrink-0"}>{p.status.replace("_", " ")}</Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5 card-shadow">
          <h3 className="mb-4 font-semibold text-foreground">Departments</h3>
          <div className="space-y-3">
            {departments?.map((d) => (
              <div key={d.id} className="flex items-center justify-between rounded-lg border p-3">
                <span className="text-sm font-medium text-foreground">{d.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-warning/30 bg-warning/5 p-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <h3 className="font-semibold text-sm text-foreground">Attention Required</h3>
        </div>
        <ul className="space-y-1 text-sm text-muted-foreground">
          {projects?.filter((p) => p.status === "on_hold").map((p) => (
            <li key={p.id}>• <strong>{p.title}</strong> — Project on hold</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ExecutiveDashboard;
