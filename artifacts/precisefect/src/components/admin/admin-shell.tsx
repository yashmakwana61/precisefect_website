import type { ReactNode } from "react";
import { Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { cmsApi } from "@/lib/cms-api";
import { AdminNav } from "./admin-nav";

export function AdminShell({ children }: { children: ReactNode }) {
  const qc = useQueryClient();
  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-border bg-surface-container-lowest sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-[1600px] mx-auto px-8 lg:px-16 py-4 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3" data-testid="link-admin-home">
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-on-primary-container">Admin</span>
            <span className="w-px h-4 bg-border" />
            <span className="text-sm font-bold text-primary">Precisefect Console</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-xs font-bold text-muted-foreground hover:text-primary uppercase tracking-[0.15em]"
              data-testid="link-view-site"
            >
              View Site
            </Link>
            <button
              type="button"
              onClick={async () => {
                await cmsApi.logout();
                await qc.invalidateQueries({ queryKey: ["auth", "me"] });
              }}
              data-testid="button-logout"
              className="text-xs font-bold text-muted-foreground hover:text-destructive uppercase tracking-[0.15em] inline-flex items-center"
            >
              <LogOut className="w-3.5 h-3.5 mr-1.5" /> Logout
            </button>
          </div>
        </div>
      </header>
      <div className="max-w-[1600px] mx-auto flex">
        <AdminNav />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
