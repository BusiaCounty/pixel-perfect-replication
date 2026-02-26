import { dashboardStats, monthlyBudgetData, statusCounts, formatCurrency } from "@/lib/mock-data";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Area, AreaChart } from "recharts";

const PIE_COLORS = ["hsl(152,60%,40%)", "hsl(205,80%,50%)", "hsl(38,92%,50%)", "hsl(215,14%,65%)", "hsl(0,72%,51%)"];

const AnalyticsPage = () => {
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
          <p className="text-3xl font-bold font-display text-foreground">{dashboardStats.completionRate}%</p>
          <p className="text-sm text-muted-foreground mt-1">Overall Completion Rate</p>
        </div>
        <div className="rounded-xl border bg-card p-5 card-shadow text-center">
          <p className="text-3xl font-bold font-display text-foreground">{formatCurrency(dashboardStats.totalBudget)}</p>
          <p className="text-sm text-muted-foreground mt-1">Total Budget Allocation</p>
        </div>
        <div className="rounded-xl border bg-card p-5 card-shadow text-center">
          <p className="text-3xl font-bold font-display text-foreground">{formatCurrency(dashboardStats.totalExpenditure)}</p>
          <p className="text-sm text-muted-foreground mt-1">Total Expenditure</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
