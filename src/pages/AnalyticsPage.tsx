import { formatCurrency } from "@/lib/mock-data";
import { useDashboardStats } from "@/hooks/use-projects";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Area, AreaChart } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

const PIE_COLORS = ["hsl(152,60%,40%)", "hsl(205,80%,50%)", "hsl(38,92%,50%)", "hsl(215,14%,65%)", "hsl(0,72%,51%)"];

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

const AnalyticsPage = () => {
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div><h1 className="text-2xl font-bold font-display text-foreground">Analytics</h1></div>
        <div className="grid gap-6 lg:grid-cols-2">
          {[1, 2].map((i) => <Skeleton key={i} className="h-80 rounded-xl" />)}
        </div>
      </div>
    );
  }

  const statusCounts = stats?.statusCounts ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground">In-depth analysis of project data and financial performance</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-5 card-shadow">
          <h3 className="mb-4 font-semibold text-foreground">Budget Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyBudgetData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,20%,88%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(215,14%,46%)" }} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(215,14%,46%)" }} />
              <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(214,20%,88%)", fontSize: "12px" }} />
              <Area type="monotone" dataKey="budget" stroke="hsl(215,60%,22%)" fill="hsl(215,60%,22%)" fillOpacity={0.1} name="Budget (M)" />
              <Area type="monotone" dataKey="expenditure" stroke="hsl(174,42%,40%)" fill="hsl(174,42%,40%)" fillOpacity={0.1} name="Expenditure (M)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border bg-card p-5 card-shadow">
          <h3 className="mb-4 font-semibold text-foreground">Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={statusCounts} dataKey="count" nameKey="label" cx="50%" cy="50%" outerRadius={100} innerRadius={55} paddingAngle={3}>
                {statusCounts.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(214,20%,88%)", fontSize: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            {statusCounts.map((s, i) => (
              <div key={s.status} className="flex items-center gap-1.5 text-xs">
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                <span className="text-muted-foreground">{s.label}: {s.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-card p-5 card-shadow text-center">
          <p className="text-3xl font-bold font-display text-foreground">{stats?.completionRate ?? 0}%</p>
          <p className="text-sm text-muted-foreground mt-1">Overall Completion Rate</p>
        </div>
        <div className="rounded-xl border bg-card p-5 card-shadow text-center">
          <p className="text-3xl font-bold font-display text-foreground">{formatCurrency(stats?.totalBudget ?? 0)}</p>
          <p className="text-sm text-muted-foreground mt-1">Total Budget Allocation</p>
        </div>
        <div className="rounded-xl border bg-card p-5 card-shadow text-center">
          <p className="text-3xl font-bold font-display text-foreground">{formatCurrency(stats?.totalExpenditure ?? 0)}</p>
          <p className="text-sm text-muted-foreground mt-1">Total Expenditure</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
