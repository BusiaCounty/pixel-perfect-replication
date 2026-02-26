import { useDepartments } from "@/hooks/use-projects";
import { Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const DepartmentsPage = () => {
  const { data: departments, isLoading } = useDepartments();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div><h1 className="text-2xl font-bold font-display text-foreground">Departments</h1></div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-40 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">Departments</h1>
        <p className="text-sm text-muted-foreground">Overview of all county departments</p>
      </div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {departments?.map((d) => (
          <div key={d.id} className="rounded-xl border bg-card p-6 card-shadow hover:card-shadow-hover transition-all">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/10">
                <Users className="h-5 w-5 text-secondary" />
              </div>
              <h3 className="font-bold font-display text-foreground">{d.name}</h3>
            </div>
            <p className="text-sm text-muted-foreground">{d.description ?? "County department"}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentsPage;
