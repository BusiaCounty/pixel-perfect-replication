import { ShieldOff } from "lucide-react";
import { useRole, type AppRole } from "@/hooks/use-role";
import { Skeleton } from "@/components/ui/skeleton";

interface RoleGateProps {
  /** Roles that ARE allowed to see the children */
  allow: AppRole[];
  children: React.ReactNode;
  /** Optional custom fallback instead of the default access-denied card */
  fallback?: React.ReactNode;
}

/**
 * Renders children only when the current user's role is in `allow`.
 * Shows a skeleton while loading and an access-denied card if the role
 * doesn't match.
 */
export function RoleGate({ allow, children, fallback }: RoleGateProps) {
  const { role, isLoading } = useRole();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    );
  }

  if (!role || !allow.includes(role)) {
    if (fallback !== undefined) return <>{fallback}</>;

    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] rounded-xl border border-dashed bg-card gap-4 p-10 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
          <ShieldOff className="h-7 w-7 text-destructive" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Access Restricted
          </h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-xs">
            You don't have permission to view this section. Contact your
            administrator if you believe this is an error.
          </p>
        </div>
        <p className="text-xs text-muted-foreground border rounded-full px-3 py-1">
          Required role:{" "}
          <span className="font-medium capitalize">{allow.join(" or ")}</span>
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
