import { formatCurrency } from "@/lib/mock-data";
import { useDashboardStats } from "@/hooks/use-projects";
import { RoleGate } from "@/components/RoleGate";
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
  Area,
  AreaChart,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

const PIE_COLORS = [
  "hsl(152,60%,40%)",
  "hsl(205,80%,50%)",
  "hsl(38,92%,50%)",
  "hsl(215,14%,65%)",
  "hsl(0,72%,51%)",
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

const departmentData = [
  { name: "Health", projects: 12, budget: 420 },
  { name: "Education", projects: 18, budget: 680 },
  { name: "Infrastructure", projects: 24, budget: 950 },
  { name: "Agriculture", projects: 9, budget: 310 },
  { name: "Water", projects: 15, budget: 540 },
];

function AnalyticsContent() {
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-80 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const statusCounts = stats?.statusCounts ?? [];
  const surplus = (stats?.totalBudget ?? 0) - (stats?.totalExpenditure ?? 0);
  const utilizationPct = stats?.totalBudget
    ? Math.round((stats.totalExpenditure / stats.totalBudget) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Summary KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Completion Rate", value: `${stats?.completionRate ?? 0}%` },
          {
            label: "Total Budget",
            value: formatCurrency(stats?.totalBudget ?? 0),
          },
          {
            label: "Total Expenditure",
            value: formatCurrency(stats?.totalExpenditure ?? 0),
          },
          {
            label: surplus >= 0 ? "Budget Surplus" : "Budget Overrun",
            value: formatCurrency(Math.abs(surplus)),
          },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-xl border bg-card p-5 card-shadow text-center"
          >
            <p className="text-2xl font-bold font-display text-foreground">
              {kpi.value}
            </p>
            <p className="text-sm text-muted-foreground mt-1">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Budget utilization bar */}
      <div className="rounded-xl border bg-card p-5 card-shadow">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground">
            Overall Budget Utilization
          </h3>
          <span className="text-sm font-semibold text-foreground">
            {utilizationPct}%
          </span>
        </div>
        <div className="h-4 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${Math.min(utilizationPct, 100)}%`,
              background:
                utilizationPct > 90
                  ? "hsl(0,72%,51%)"
                  : utilizationPct > 70
                    ? "hsl(38,92%,50%)"
                    : "hsl(152,60%,40%)",
            }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>{formatCurrency(stats?.totalExpenditure ?? 0)} spent</span>
          <span>{formatCurrency(stats?.totalBudget ?? 0)} allocated</span>
        </div>
      </div>

      {/* Charts row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-5 card-shadow">
          <h3 className="mb-4 font-semibold text-foreground">
            Budget Trend (KES Millions)
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlyBudgetData}>
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
              <Area
                type="monotone"
                dataKey="budget"
                stroke="hsl(215,60%,22%)"
                fill="hsl(215,60%,22%)"
                fillOpacity={0.1}
                name="Budget (M)"
              />
              <Area
                type="monotone"
                dataKey="expenditure"
                stroke="hsl(174,42%,40%)"
                fill="hsl(174,42%,40%)"
                fillOpacity={0.15}
                name="Expenditure (M)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border bg-card p-5 card-shadow">
          <h3 className="mb-4 font-semibold text-foreground">
            Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={statusCounts}
                dataKey="count"
                nameKey="label"
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={48}
                paddingAngle={3}
              >
                {statusCounts.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i]} />
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
          <div className="flex flex-wrap gap-3 justify-center mt-1">
            {statusCounts.map((s, i) => (
              <div key={s.status} className="flex items-center gap-1.5 text-xs">
                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: PIE_COLORS[i] }}
                />
                <span className="text-muted-foreground">
                  {s.label}:{" "}
                  <strong className="text-foreground">{s.count}</strong>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Department breakdown */}
      <div className="rounded-xl border bg-card p-5 card-shadow">
        <h3 className="mb-4 font-semibold text-foreground">
          Department Budget Breakdown (KES Millions)
        </h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={departmentData} layout="vertical">
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(214,20%,88%)"
              horizontal={false}
            />
            <XAxis
              type="number"
              tick={{ fontSize: 12, fill: "hsl(215,14%,46%)" }}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 12, fill: "hsl(215,14%,46%)" }}
              width={90}
            />
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
              radius={[0, 4, 4, 0]}
              name="Budget (M)"
            />
            <Bar
              dataKey="projects"
              fill="hsl(174,42%,40%)"
              radius={[0, 4, 4, 0]}
              name="Projects"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const AnalyticsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">
          Analytics
        </h1>
        <p className="text-sm text-muted-foreground">
          In-depth financial and performance analysis — executive access only
        </p>
      </div>

      <RoleGate allow={["executive", "admin"]}>
        <AnalyticsContent />
      </RoleGate>
    </div>
  );
};

export default AnalyticsPage;
