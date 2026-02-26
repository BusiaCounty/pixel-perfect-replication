import { Link } from "react-router-dom";
import { Building2, BarChart3, Users, MapPin, ArrowRight, TrendingUp, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency, getStatusColor } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { useProjects, useDashboardStats, useDepartments } from "@/hooks/use-projects";
import { Skeleton } from "@/components/ui/skeleton";

const StatCard = ({ icon: Icon, label, value, sub }: { icon: any; label: string; value: string; sub?: string }) => (
  <div className="flex flex-col gap-2 rounded-xl bg-card p-6 card-shadow animate-fade-in">
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
    </div>
    <p className="text-3xl font-bold font-display text-foreground">{value}</p>
    {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
  </div>
);

const Index = () => {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: departments } = useDepartments();

  const flagshipProjects = (projects ?? []).filter((p) => p.is_flagship);

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Building2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <span className="text-lg font-bold font-display text-foreground">County PMTS</span>
            </div>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link to="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Home</Link>
            <Link to="/projects" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Projects</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="outline" size="sm">Staff Login</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="hero-gradient relative overflow-hidden py-24 lg:py-32">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0aDR2NGgtNHpNMjAgMjBoNHY0aC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-6 bg-accent/20 text-accent-foreground border-accent/30 hover:bg-accent/30">
              Transparency · Accountability · Efficiency
            </Badge>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-primary-foreground lg:text-6xl">
              County Project Management & Tracking System
            </h1>
            <p className="mb-10 text-lg text-primary-foreground/80 lg:text-xl">
              Real-time visibility into county development projects. Track progress, budgets, and outcomes across all departments and wards.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link to="/projects">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold shadow-lg">
                  Browse All Projects
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  Staff Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container -mt-12 relative z-10">
        {statsLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={BarChart3} label="Total Projects" value={(stats?.totalProjects ?? 0).toString()} sub="Across all departments" />
            <StatCard icon={CheckCircle2} label="Completed" value={(stats?.completedProjects ?? 0).toString()} sub={`${stats?.completionRate ?? 0}% completion rate`} />
            <StatCard icon={TrendingUp} label="Total Budget" value={formatCurrency(stats?.totalBudget ?? 0)} sub={`${formatCurrency(stats?.totalExpenditure ?? 0)} spent`} />
            <StatCard icon={Clock} label="Ongoing" value={(stats?.ongoingProjects ?? 0).toString()} sub={`${stats?.planningProjects ?? 0} in planning`} />
          </div>
        )}
      </section>

      {/* Flagship Projects */}
      <section className="container py-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Flagship Projects</h2>
            <p className="mt-2 text-muted-foreground">Key development initiatives driving county transformation</p>
          </div>
          <Link to="/projects" className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline md:flex">
            View all projects <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {projectsLoading ? (
          <div className="grid gap-6 md:grid-cols-2">
            {[1, 2].map((i) => <Skeleton key={i} className="h-64 rounded-xl" />)}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {flagshipProjects.map((project, i) => (
              <div
                key={project.id}
                className="group rounded-xl border bg-card p-6 card-shadow transition-all duration-300 hover:card-shadow-hover hover:-translate-y-0.5"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="mb-4 flex items-start justify-between">
                  <Badge className={getStatusColor(project.status) + " capitalize text-xs"}>
                    {project.status.replace("_", " ")}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{(project as any).departments?.name ?? "—"}</span>
                </div>
                <h3 className="mb-2 text-xl font-bold font-display text-foreground group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="mb-4 text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  {project.ward}, {project.subcounty}
                </div>
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-semibold text-foreground">{project.completion_percentage}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-secondary transition-all duration-700"
                    style={{ width: `${project.completion_percentage}%` }}
                  />
                </div>
                <div className="mt-4 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Budget: <span className="font-medium text-foreground">{formatCurrency(Number(project.budget_allocation))}</span></span>
                  <span className="text-muted-foreground">Spent: <span className="font-medium text-foreground">{formatCurrency(Number(project.expenditure))}</span></span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Departments */}
      <section className="bg-muted/50 py-20">
        <div className="container">
          <h2 className="mb-10 text-3xl font-bold text-foreground text-center">Departments Overview</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {departments?.map((dept) => (
              <div key={dept.id} className="rounded-xl border bg-card p-5 card-shadow hover:card-shadow-hover transition-all">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
                    <Users className="h-5 w-5 text-secondary" />
                  </div>
                  <h3 className="font-semibold text-foreground">{dept.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{dept.description ?? "County department"}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-12">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <span className="font-display font-bold text-foreground">County PMTS</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 County Government. Project Management & Tracking System.
            </p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <Link to="/projects" className="hover:text-primary transition-colors">Projects</Link>
              <Link to="/login" className="hover:text-primary transition-colors">Staff Login</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
