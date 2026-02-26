import { useState } from "react";
import {
  ShieldCheck,
  Users,
  FolderKanban,
  Building2,
  Settings2,
  Pencil,
  Trash2,
  Plus,
  Check,
  X,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
const ROLE_COLORS: Record<string, string> = {
  admin: "bg-red-100 text-red-700 border-red-200",
  executive: "bg-purple-100 text-purple-700 border-purple-200",
  staff: "bg-blue-100 text-blue-700 border-blue-200",
};

const STATUS_COLORS: Record<string, string> = {
  planning: "bg-yellow-100 text-yellow-700 border-yellow-200",
  ongoing: "bg-blue-100 text-blue-700 border-blue-200",
  completed: "bg-green-100 text-green-700 border-green-200",
  on_hold: "bg-orange-100 text-orange-700 border-orange-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
};

// ─────────────────────────────────────────────
// Shared small UI pieces
// ─────────────────────────────────────────────
function SectionHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between mb-5">
      <div>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}

function EmptyState({
  icon: Icon,
  message,
}: {
  icon: React.ElementType;
  message: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
      <Icon className="h-10 w-10 opacity-30" />
      <p className="text-sm">{message}</p>
    </div>
  );
}

function CardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────
// USERS TAB
// ─────────────────────────────────────────────
type UserRoleRow = Tables<"user_roles">;
type ProfileRow = Tables<"profiles">;

interface EnrichedUser {
  profile: ProfileRow;
  roles: UserRoleRow[];
}

function UsersTab() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");

  const { data: profiles, isLoading: profilesLoading } = useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("full_name");
      if (error) throw error;
      return data as ProfileRow[];
    },
  });

  const { data: allRoles, isLoading: rolesLoading } = useQuery({
    queryKey: ["admin-all-roles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("user_roles").select("*");
      if (error) throw error;
      return data as UserRoleRow[];
    },
  });

  const setRoleMutation = useMutation({
    mutationFn: async ({
      userId,
      role,
    }: {
      userId: string;
      role: "staff" | "executive" | "admin";
    }) => {
      await supabase.from("user_roles").delete().eq("user_id", userId);
      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-all-roles"] });
      toast({
        title: "Role updated",
        description: "User role was changed successfully.",
      });
    },
    onError: () =>
      toast({
        title: "Error",
        description: "Failed to update role.",
        variant: "destructive",
      }),
  });

  const isLoading = profilesLoading || rolesLoading;

  const enriched: EnrichedUser[] =
    profiles?.map((p) => ({
      profile: p,
      roles: allRoles?.filter((r) => r.user_id === p.user_id) ?? [],
    })) ?? [];

  const filtered = enriched.filter(
    (u) =>
      !search ||
      u.profile.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.profile.user_id?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <SectionHeader
        title="User Management"
        subtitle={`${profiles?.length ?? 0} registered users`}
      />
      <div className="mb-4">
        <Input
          id="admin-user-search"
          placeholder="Search by name or ID…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <CardShell>
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-14 rounded-lg" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={Users} message="No users found." />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40 text-muted-foreground text-xs uppercase tracking-wide">
                <th className="px-4 py-3 text-left font-medium">Name</th>
                <th className="px-4 py-3 text-left font-medium">Department</th>
                <th className="px-4 py-3 text-left font-medium">
                  Current Role
                </th>
                <th className="px-4 py-3 text-left font-medium">Change Role</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(({ profile, roles }) => {
                const currentRole = roles[0]?.role ?? "none";
                return (
                  <tr
                    key={profile.id}
                    className="border-b last:border-0 hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {profile.full_name ?? (
                        <span className="italic text-muted-foreground">
                          Unnamed
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {profile.department ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        className={`border text-xs capitalize ${ROLE_COLORS[currentRole] ?? "bg-muted text-muted-foreground"}`}
                      >
                        {currentRole}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Select
                        defaultValue={
                          currentRole !== "none" ? currentRole : undefined
                        }
                        onValueChange={(val) =>
                          setRoleMutation.mutate({
                            userId: profile.user_id,
                            role: val as "staff" | "executive" | "admin",
                          })
                        }
                      >
                        <SelectTrigger
                          className="h-8 w-36 text-xs"
                          id={`role-select-${profile.id}`}
                        >
                          <SelectValue placeholder="Assign role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="staff">Staff</SelectItem>
                          <SelectItem value="executive">Executive</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </CardShell>
    </div>
  );
}

// ─────────────────────────────────────────────
// PROJECTS TAB
// ─────────────────────────────────────────────
type ProjectRow = Tables<"projects">;

const PROJECT_STATUSES = [
  "planning",
  "ongoing",
  "completed",
  "on_hold",
  "cancelled",
] as const;

interface ProjectFormData {
  title: string;
  description: string;
  status: (typeof PROJECT_STATUSES)[number];
  county: string;
  subcounty: string;
  ward: string;
  budget_allocation: string;
  expenditure: string;
  completion_percentage: string;
  is_flagship: boolean;
  department_id: string;
}

const defaultProjectForm = (): ProjectFormData => ({
  title: "",
  description: "",
  status: "planning",
  county: "",
  subcounty: "",
  ward: "",
  budget_allocation: "0",
  expenditure: "0",
  completion_percentage: "0",
  is_flagship: false,
  department_id: "",
});

function ProjectsTab() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [editing, setEditing] = useState<string | null>(null); // project id or "new"
  const [form, setForm] = useState<ProjectFormData>(defaultProjectForm());
  const [search, setSearch] = useState("");

  const { data: projects, isLoading } = useQuery({
    queryKey: ["admin-projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*, departments(name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as (ProjectRow & { departments: { name: string } | null })[];
    },
  });

  const { data: departments } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("departments")
        .select("id,name")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        title: form.title,
        description: form.description,
        status: form.status,
        county: form.county,
        subcounty: form.subcounty,
        ward: form.ward,
        budget_allocation: Number(form.budget_allocation),
        expenditure: Number(form.expenditure),
        completion_percentage: Number(form.completion_percentage),
        is_flagship: form.is_flagship,
        department_id: form.department_id || null,
      };
      if (editing === "new") {
        const { error } = await supabase.from("projects").insert(payload);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("projects")
          .update(payload)
          .eq("id", editing!);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-projects"] });
      qc.invalidateQueries({ queryKey: ["projects"] });
      qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
      toast({
        title: editing === "new" ? "Project created" : "Project updated",
      });
      setEditing(null);
      setForm(defaultProjectForm());
    },
    onError: () =>
      toast({
        title: "Error",
        description: "Failed to save project.",
        variant: "destructive",
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-projects"] });
      qc.invalidateQueries({ queryKey: ["projects"] });
      qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
      toast({ title: "Project deleted" });
    },
    onError: () =>
      toast({
        title: "Error",
        description: "Failed to delete project.",
        variant: "destructive",
      }),
  });

  const startEdit = (p: ProjectRow) => {
    setForm({
      title: p.title,
      description: p.description ?? "",
      status: p.status,
      county: p.county,
      subcounty: p.subcounty ?? "",
      ward: p.ward ?? "",
      budget_allocation: String(p.budget_allocation),
      expenditure: String(p.expenditure),
      completion_percentage: String(p.completion_percentage),
      is_flagship: p.is_flagship,
      department_id: p.department_id ?? "",
    });
    setEditing(p.id);
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm(defaultProjectForm());
  };

  const filtered =
    projects?.filter(
      (p) => !search || p.title.toLowerCase().includes(search.toLowerCase()),
    ) ?? [];

  return (
    <div>
      <SectionHeader
        title="Projects Management"
        subtitle={`${projects?.length ?? 0} total projects`}
        action={
          <Button
            id="admin-add-project-btn"
            size="sm"
            onClick={() => {
              setForm(defaultProjectForm());
              setEditing("new");
            }}
            className="gap-1.5"
          >
            <Plus className="h-4 w-4" /> New Project
          </Button>
        }
      />

      {/* Inline form */}
      {editing && (
        <div className="mb-5 rounded-xl border bg-card p-5 shadow-sm">
          <h3 className="font-semibold text-foreground mb-4">
            {editing === "new" ? "Create New Project" : "Edit Project"}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Title *
              </label>
              <Input
                id="project-form-title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Project title"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Description
              </label>
              <Textarea
                id="project-form-description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Project description"
                rows={3}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Status
              </label>
              <Select
                value={form.status}
                onValueChange={(v) =>
                  setForm({
                    ...form,
                    status: v as (typeof PROJECT_STATUSES)[number],
                  })
                }
              >
                <SelectTrigger id="project-form-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROJECT_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Department
              </label>
              <Select
                value={form.department_id}
                onValueChange={(v) => setForm({ ...form, department_id: v })}
              >
                <SelectTrigger id="project-form-department">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments?.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                County
              </label>
              <Input
                id="project-form-county"
                value={form.county}
                onChange={(e) => setForm({ ...form, county: e.target.value })}
                placeholder="County"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Sub-county
              </label>
              <Input
                id="project-form-subcounty"
                value={form.subcounty}
                onChange={(e) =>
                  setForm({ ...form, subcounty: e.target.value })
                }
                placeholder="Sub-county"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Ward
              </label>
              <Input
                id="project-form-ward"
                value={form.ward}
                onChange={(e) => setForm({ ...form, ward: e.target.value })}
                placeholder="Ward"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Budget Allocation (KES)
              </label>
              <Input
                id="project-form-budget"
                type="number"
                value={form.budget_allocation}
                onChange={(e) =>
                  setForm({ ...form, budget_allocation: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Expenditure (KES)
              </label>
              <Input
                id="project-form-expenditure"
                type="number"
                value={form.expenditure}
                onChange={(e) =>
                  setForm({ ...form, expenditure: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Completion %
              </label>
              <Input
                id="project-form-completion"
                type="number"
                min={0}
                max={100}
                value={form.completion_percentage}
                onChange={(e) =>
                  setForm({ ...form, completion_percentage: e.target.value })
                }
              />
            </div>
            <div className="flex items-center gap-2 mt-1">
              <input
                id="project-form-flagship"
                type="checkbox"
                checked={form.is_flagship}
                onChange={(e) =>
                  setForm({ ...form, is_flagship: e.target.checked })
                }
                className="h-4 w-4 rounded border-input accent-primary"
              />
              <label
                htmlFor="project-form-flagship"
                className="text-sm text-foreground cursor-pointer"
              >
                Flagship Project
              </label>
            </div>
          </div>
          <div className="mt-5 flex gap-2 justify-end">
            <Button
              id="project-form-cancel"
              variant="outline"
              size="sm"
              onClick={cancelEdit}
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button
              id="project-form-save"
              size="sm"
              onClick={() => saveMutation.mutate()}
              disabled={!form.title || saveMutation.isPending}
            >
              {saveMutation.isPending ? (
                <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <Check className="h-4 w-4 mr-1" />
              )}
              {editing === "new" ? "Create" : "Save Changes"}
            </Button>
          </div>
        </div>
      )}

      <div className="mb-4">
        <Input
          id="admin-project-search"
          placeholder="Search projects…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <CardShell>
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-14 rounded-lg" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={FolderKanban} message="No projects found." />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40 text-muted-foreground text-xs uppercase tracking-wide">
                <th className="px-4 py-3 text-left font-medium">Title</th>
                <th className="px-4 py-3 text-left font-medium hidden md:table-cell">
                  Department
                </th>
                <th className="px-4 py-3 text-left font-medium hidden lg:table-cell">
                  County
                </th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium hidden lg:table-cell">
                  Budget (KES)
                </th>
                <th className="px-4 py-3 text-left font-medium hidden xl:table-cell">
                  %
                </th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  className="border-b last:border-0 hover:bg-muted/20 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-foreground max-w-[180px] truncate">
                    {p.title}
                    {p.is_flagship && (
                      <span className="ml-2 text-[10px] bg-yellow-100 text-yellow-700 border border-yellow-200 rounded px-1 py-0.5">
                        Flagship
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                    {(p as any).departments?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                    {p.county}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      className={`border text-[10px] capitalize ${STATUS_COLORS[p.status] ?? ""}`}
                    >
                      {p.status.replace("_", " ")}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                    {Number(p.budget_allocation).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden xl:table-cell">
                    {p.completion_percentage}%
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center gap-1 justify-end">
                      <Button
                        id={`edit-project-${p.id}`}
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => startEdit(p)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        id={`delete-project-${p.id}`}
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          if (window.confirm(`Delete "${p.title}"?`))
                            deleteMutation.mutate(p.id);
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardShell>
    </div>
  );
}

// ─────────────────────────────────────────────
// DEPARTMENTS TAB
// ─────────────────────────────────────────────
type DeptRow = Tables<"departments">;

function DepartmentsTab() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", description: "" });

  const { data: departments, isLoading } = useQuery({
    queryKey: ["admin-departments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("departments")
        .select("*")
        .order("name");
      if (error) throw error;
      return data as DeptRow[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editing === "new") {
        const { error } = await supabase
          .from("departments")
          .insert({ name: form.name, description: form.description });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("departments")
          .update({ name: form.name, description: form.description })
          .eq("id", editing!);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-departments"] });
      qc.invalidateQueries({ queryKey: ["departments"] });
      toast({
        title: editing === "new" ? "Department created" : "Department updated",
      });
      setEditing(null);
      setForm({ name: "", description: "" });
    },
    onError: () =>
      toast({
        title: "Error",
        description: "Failed to save department.",
        variant: "destructive",
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("departments")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-departments"] });
      qc.invalidateQueries({ queryKey: ["departments"] });
      toast({ title: "Department deleted" });
    },
    onError: () =>
      toast({
        title: "Error",
        description: "Failed to delete department.",
        variant: "destructive",
      }),
  });

  return (
    <div>
      <SectionHeader
        title="Departments Management"
        subtitle={`${departments?.length ?? 0} departments`}
        action={
          <Button
            id="admin-add-dept-btn"
            size="sm"
            onClick={() => {
              setForm({ name: "", description: "" });
              setEditing("new");
            }}
            className="gap-1.5"
          >
            <Plus className="h-4 w-4" /> New Department
          </Button>
        }
      />

      {editing && (
        <div className="mb-5 rounded-xl border bg-card p-5 shadow-sm">
          <h3 className="font-semibold text-foreground mb-4">
            {editing === "new" ? "Create Department" : "Edit Department"}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Name *
              </label>
              <Input
                id="dept-form-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Department name"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Description
              </label>
              <Textarea
                id="dept-form-description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Optional description"
                rows={2}
              />
            </div>
          </div>
          <div className="mt-5 flex gap-2 justify-end">
            <Button
              id="dept-form-cancel"
              variant="outline"
              size="sm"
              onClick={() => setEditing(null)}
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button
              id="dept-form-save"
              size="sm"
              disabled={!form.name || saveMutation.isPending}
              onClick={() => saveMutation.mutate()}
            >
              {saveMutation.isPending ? (
                <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <Check className="h-4 w-4 mr-1" />
              )}
              {editing === "new" ? "Create" : "Save"}
            </Button>
          </div>
        </div>
      )}

      <CardShell>
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-14 rounded-lg" />
            ))}
          </div>
        ) : (departments?.length ?? 0) === 0 ? (
          <EmptyState icon={Building2} message="No departments yet." />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40 text-muted-foreground text-xs uppercase tracking-wide">
                <th className="px-4 py-3 text-left font-medium">Name</th>
                <th className="px-4 py-3 text-left font-medium hidden md:table-cell">
                  Description
                </th>
                <th className="px-4 py-3 text-left font-medium hidden lg:table-cell">
                  Created
                </th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {departments!.map((d) => (
                <tr
                  key={d.id}
                  className="border-b last:border-0 hover:bg-muted/20 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-foreground">
                    {d.name}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell max-w-[260px] truncate">
                    {d.description ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                    {new Date(d.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center gap-1 justify-end">
                      <Button
                        id={`edit-dept-${d.id}`}
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => {
                          setForm({
                            name: d.name,
                            description: d.description ?? "",
                          });
                          setEditing(d.id);
                        }}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        id={`delete-dept-${d.id}`}
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          if (window.confirm(`Delete department "${d.name}"?`))
                            deleteMutation.mutate(d.id);
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardShell>
    </div>
  );
}

// ─────────────────────────────────────────────
// APP SETTINGS TAB
// ─────────────────────────────────────────────
function AppSettingsTab() {
  const { toast } = useToast();
  const [appName, setAppName] = useState(
    "Project Management & Tracking System",
  );
  const [appDesc, setAppDesc] = useState(
    "A county-level project monitoring and tracking system.",
  );
  const [county, setCounty] = useState("Busia County");
  const [fiscalYear, setFiscalYear] = useState("2025/2026");
  const [allowPublicView, setAllowPublicView] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const handleSave = () => {
    // In a real app, these would be stored in a settings table in Supabase.
    // For now we persist to localStorage as a simple demonstration.
    localStorage.setItem(
      "admin_settings",
      JSON.stringify({
        appName,
        appDesc,
        county,
        fiscalYear,
        allowPublicView,
        maintenanceMode,
      }),
    );
    toast({
      title: "Settings saved",
      description: "Application settings have been updated.",
    });
  };

  return (
    <div>
      <SectionHeader
        title="Application Settings"
        subtitle="Control global configuration for the system."
      />

      <div className="grid gap-5 lg:grid-cols-2">
        {/* General */}
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Settings2 className="h-4 w-4 text-primary" /> General
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Application Name
              </label>
              <Input
                id="settings-app-name"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Application Description
              </label>
              <Textarea
                id="settings-app-desc"
                value={appDesc}
                onChange={(e) => setAppDesc(e.target.value)}
                rows={2}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                County Name
              </label>
              <Input
                id="settings-county"
                value={county}
                onChange={(e) => setCounty(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Current Fiscal Year
              </label>
              <Input
                id="settings-fiscal-year"
                value={fiscalYear}
                onChange={(e) => setFiscalYear(e.target.value)}
                placeholder="e.g. 2025/2026"
              />
            </div>
          </div>
        </div>

        {/* Access control */}
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" /> Access & Visibility
          </h3>
          <div className="space-y-5">
            <div className="flex items-start justify-between gap-4 rounded-lg border p-4">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Public Project Visibility
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Allow unauthenticated users to browse projects on the public
                  page.
                </p>
              </div>
              <button
                id="settings-toggle-public"
                onClick={() => setAllowPublicView(!allowPublicView)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${allowPublicView ? "bg-primary" : "bg-muted-foreground/30"}`}
                role="switch"
                aria-checked={allowPublicView}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform ${allowPublicView ? "translate-x-6" : "translate-x-1"}`}
                />
              </button>
            </div>

            <div className="flex items-start justify-between gap-4 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
              <div>
                <p className="text-sm font-medium text-foreground flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-destructive" />{" "}
                  Maintenance Mode
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  When enabled, shows a maintenance notice to non-admin users.
                </p>
              </div>
              <button
                id="settings-toggle-maintenance"
                onClick={() => setMaintenanceMode(!maintenanceMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2 ${maintenanceMode ? "bg-destructive" : "bg-muted-foreground/30"}`}
                role="switch"
                aria-checked={maintenanceMode}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform ${maintenanceMode ? "translate-x-6" : "translate-x-1"}`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 flex justify-end">
        <Button id="settings-save-btn" onClick={handleSave} className="gap-1.5">
          <Check className="h-4 w-4" /> Save Settings
        </Button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ROOT PAGE
// ─────────────────────────────────────────────
const SuperAdminPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900/30">
          <ShieldCheck className="h-5 w-5 text-red-600 dark:text-red-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground leading-none">
            Super Admin
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Full system control — users, projects, departments & settings
          </p>
        </div>
      </div>

      {/* Warning banner */}
      <div className="flex items-start gap-3 rounded-xl border border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-700/50 px-4 py-3 text-sm text-yellow-800 dark:text-yellow-300">
        <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
        <p>
          Changes made here are applied immediately and may affect all users.
          Proceed with caution.
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="users" id="admin-tabs">
        <TabsList className="mb-2 h-10 gap-1">
          <TabsTrigger
            value="users"
            id="admin-tab-users"
            className="gap-1.5 text-xs sm:text-sm"
          >
            <Users className="h-3.5 w-3.5" /> Users
          </TabsTrigger>
          <TabsTrigger
            value="projects"
            id="admin-tab-projects"
            className="gap-1.5 text-xs sm:text-sm"
          >
            <FolderKanban className="h-3.5 w-3.5" /> Projects
          </TabsTrigger>
          <TabsTrigger
            value="departments"
            id="admin-tab-departments"
            className="gap-1.5 text-xs sm:text-sm"
          >
            <Building2 className="h-3.5 w-3.5" /> Departments
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            id="admin-tab-settings"
            className="gap-1.5 text-xs sm:text-sm"
          >
            <Settings2 className="h-3.5 w-3.5" /> Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <UsersTab />
        </TabsContent>
        <TabsContent value="projects">
          <ProjectsTab />
        </TabsContent>
        <TabsContent value="departments">
          <DepartmentsTab />
        </TabsContent>
        <TabsContent value="settings">
          <AppSettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SuperAdminPage;
