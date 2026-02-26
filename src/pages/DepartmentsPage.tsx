import { departments, formatCurrency } from "@/lib/mock-data";
import { Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const DepartmentsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">Departments</h1>
        <p className="text-sm text-muted-foreground">Overview of all county departments and their project performance</p>
      </div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {departments.map((d) => {
          const utilization = Math.round((d.totalExpenditure / d.totalBudget) * 100);
          return (
            <div key={d.id} className="rounded-xl border bg-card p-6 card-shadow hover:card-shadow-hover transition-all">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/10">
                  <Users className="h-5 w-5 text-secondary" />
                </div>
                <h3 className="font-bold font-display text-foreground">{d.name}</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Projects</span>
                  <span className="font-semibold text-foreground">{d.projectCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Budget</span>
                  <span className="font-semibold text-foreground">{formatCurrency(d.totalBudget)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Expenditure</span>
                  <span className="font-semibold text-foreground">{formatCurrency(d.totalExpenditure)}</span>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Utilization</span>
                    <span className="font-medium text-foreground">{utilization}%</span>
                  </div>
                  <Progress value={utilization} className="h-2" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DepartmentsPage;
