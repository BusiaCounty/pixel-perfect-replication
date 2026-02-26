import { useState } from "react";
import { Link } from "react-router-dom";
import { Building2, Search, MapPin, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency, getStatusColor } from "@/lib/mock-data";
import { useProjects, useDepartments } from "@/hooks/use-projects";
import { Skeleton } from "@/components/ui/skeleton";

const ProjectsPage = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deptFilter, setDeptFilter] = useState<string>("all");
  const { data: projects, isLoading } = useProjects();
  const { data: departments } = useDepartments();

  const filtered = (projects ?? []).filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || (p.description ?? "").toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    const matchesDept = deptFilter === "all" || p.department_id === deptFilter;
    return matchesSearch && matchesStatus && matchesDept;
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Building2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold font-display text-foreground">County PMTS</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Home</Link>
            <Link to="/projects" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Projects</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login"><Button variant="outline" size="sm">Staff Login</Button></Link>
          </div>
        </div>
      </header>

      <section className="hero-gradient py-16">
        <div className="container text-center">
          <h1 className="text-3xl font-bold text-primary-foreground lg:text-4xl">All County Projects</h1>
          <p className="mt-3 text-primary-foreground/70">Browse and track all development projects across the county</p>
        </div>
      </section>

      <div className="container -mt-6 relative z-10">
        <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 card-shadow sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search projects..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="ongoing">Ongoing</SelectItem>
              <SelectItem value="planning">Planning</SelectItem>
              <SelectItem value="on_hold">On Hold</SelectItem>
            </SelectContent>
          </Select>
          <Select value={deptFilter} onValueChange={setDeptFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments?.map((d) => (
                <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="container py-10">
        {isLoading ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-64 rounded-xl" />)}
          </div>
        ) : (
          <>
            <p className="mb-6 text-sm text-muted-foreground">{filtered.length} project{filtered.length !== 1 ? "s" : ""} found</p>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((project) => (
                <div key={project.id} className="group flex flex-col rounded-xl border bg-card p-5 card-shadow transition-all hover:card-shadow-hover hover:-translate-y-0.5">
                  <div className="mb-3 flex items-start justify-between">
                    <Badge className={getStatusColor(project.status) + " capitalize text-xs"}>{project.status.replace("_", " ")}</Badge>
                    {project.is_flagship && <Badge variant="outline" className="border-accent text-accent text-[10px]">Flagship</Badge>}
                  </div>
                  <h3 className="mb-2 font-bold font-display text-foreground group-hover:text-primary transition-colors">{project.title}</h3>
                  <p className="mb-3 text-sm text-muted-foreground line-clamp-2 flex-1">{project.description}</p>
                  <div className="mb-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {project.ward}, {project.subcounty}
                  </div>
                  <div className="mb-2 flex justify-between text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-semibold text-foreground">{project.completion_percentage}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-secondary transition-all" style={{ width: `${project.completion_percentage}%` }} />
                  </div>
                  <div className="mt-3 flex justify-between text-xs text-muted-foreground">
                    <span>Budget: <span className="font-medium text-foreground">{formatCurrency(Number(project.budget_allocation))}</span></span>
                    <span>{(project as any).departments?.name ?? "—"}</span>
                  </div>
                </div>
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="py-20 text-center">
                <p className="text-lg text-muted-foreground">No projects match your filters.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
