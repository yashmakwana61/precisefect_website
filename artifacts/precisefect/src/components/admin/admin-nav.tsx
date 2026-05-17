import type { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import {
  LEADS_NAV,
  CONTENT_COLLECTIONS,
  SITE_TOOLS,
  SYSTEM_TOOLS,
  MEDIA_TOOL,
  collectionAdminPath,
} from "@/admin/registry";

function NavLink({ href, label }: { href: string; label: string }) {
  const [location] = useLocation();
  const active = location === href || (href !== "/admin" && location.startsWith(href));
  return (
    <Link
      href={href}
      className={`block text-xs font-bold uppercase tracking-[0.12em] px-3 py-2 rounded-md transition-colors ${
        active
          ? "bg-primary text-white"
          : "text-muted-foreground hover:text-primary hover:bg-surface-container-low"
      }`}
    >
      {label}
    </Link>
  );
}

function NavSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-bold text-muted-foreground tracking-[0.18em] uppercase mb-2 px-3">
        {title}
      </p>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

export function AdminNav() {
  return (
    <nav className="w-56 shrink-0 border-r border-border bg-surface-container-lowest p-4 space-y-6 sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto hidden lg:block">
      <NavSection title="Overview">
        <NavLink href="/admin" label="Dashboard" />
      </NavSection>

      <NavSection title="Leads">
        {LEADS_NAV.map((t) => (
          <NavLink key={t.href} href={t.href} label={t.name} />
        ))}
      </NavSection>

      <NavSection title="Content">
        {CONTENT_COLLECTIONS.map((c) => (
          <NavLink key={c.slug} href={collectionAdminPath(c.slug)} label={c.name} />
        ))}
      </NavSection>

      <NavSection title="Site">
        {SITE_TOOLS.map((t) => (
          <NavLink key={t.href} href={t.href} label={t.name} />
        ))}
      </NavSection>

      <NavSection title="Media">
        <NavLink href={MEDIA_TOOL.href} label={MEDIA_TOOL.name} />
      </NavSection>

      <NavSection title="System">
        {SYSTEM_TOOLS.map((t) => (
          <NavLink key={t.href} href={t.href} label={t.name} />
        ))}
      </NavSection>
    </nav>
  );
}
