import { useQuery } from "@tanstack/react-query";
import { cmsApi } from "@/lib/cms-api";

export default function AdminUsers() {
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["system", "users"],
    queryFn: () => cmsApi.listUsers(),
  });

  return (
    <div className="px-8 lg:px-16 py-12">
      <p className="text-xs font-bold text-on-primary-container tracking-[0.2em] uppercase mb-4">System</p>
      <h1 className="text-3xl font-bold text-primary mb-4 tracking-tight">Users & Roles</h1>
      <p className="text-sm text-muted-foreground mb-8 max-w-xl">
        Phase 1: read-only list. Run <code className="font-mono text-xs">pnpm --filter @workspace/scripts seed-foundation</code> after
        migrating the database to create the bootstrap admin user.
      </p>

      {isLoading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : (
        <div className="overflow-x-auto border border-border rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-surface-container-low text-left">
              <tr>
                <th className="px-4 py-3 font-bold">Name</th>
                <th className="px-4 py-3 font-bold">Email</th>
                <th className="px-4 py-3 font-bold">Roles</th>
                <th className="px-4 py-3 font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-border">
                  <td className="px-4 py-3">{u.displayName}</td>
                  <td className="px-4 py-3 font-mono text-xs">{u.email}</td>
                  <td className="px-4 py-3">
                    {u.roles.length ? u.roles.map((r) => r.label).join(", ") : "—"}
                  </td>
                  <td className="px-4 py-3">{u.isActive ? "Active" : "Inactive"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
