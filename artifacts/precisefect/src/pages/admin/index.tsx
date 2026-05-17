import { lazy, Suspense } from "react";
import { Switch, Route, Redirect, useParams } from "wouter";
import { useAdmin } from "@/hooks/use-admin";
import { AdminShell } from "@/components/admin/admin-shell";
import { LEGACY_COLLECTION_SLUGS, collectionAdminPath } from "@/admin/registry";
import type { CollectionName } from "@/lib/cms-api";

const AdminLogin = lazy(() => import("./login"));
const AdminDashboard = lazy(() => import("./dashboard"));
const CollectionList = lazy(() => import("./collection-list"));
const CollectionEdit = lazy(() => import("./collection-edit"));
const SeoManager = lazy(() => import("./seo-manager"));
const AdminSettings = lazy(() => import("./settings"));
const PagesList = lazy(() => import("./pages-list"));
const PageEdit = lazy(() => import("./page-edit"));
const SitePageEdit = lazy(() => import("./site-page-edit"));
const SiteBlocksEditor = lazy(() => import("./site-blocks"));
const AdminActivity = lazy(() => import("./activity"));
const MediaLibrary = lazy(() => import("./media-library"));
const AdminUsers = lazy(() => import("./users"));
const LeadsList = lazy(() => import("./leads-list"));
const LeadDetail = lazy(() => import("./lead-detail"));
const LeadNew = lazy(() => import("./lead-new"));
const LeadsKanban = lazy(() => import("./leads-kanban"));
const AdminAutomation = lazy(() => import("./automation"));
const AdminIntegrations = lazy(() => import("./integrations"));

function AdminPageFallback() {
  return (
    <div className="min-h-[40vh] flex items-center justify-center text-muted-foreground">
      Loading…
    </div>
  );
}

function isCollectionSlug(slug: string): slug is CollectionName {
  return (LEGACY_COLLECTION_SLUGS as readonly string[]).includes(slug);
}

function LegacyCollectionRedirect() {
  const params = useParams<{ collection: string; id?: string }>();
  const slug = params.collection ?? "";
  if (slug === "leads" || slug === "content" || slug === "site" || slug === "system" || slug === "media") {
    return <Redirect to="/admin" />;
  }
  if (!isCollectionSlug(slug)) {
    return <Redirect to="/admin" />;
  }
  const base = collectionAdminPath(slug);
  if (params.id) {
    return <Redirect to={`${base}/${params.id}`} />;
  }
  return <Redirect to={base} />;
}

function LegacyPageEditRedirect() {
  const { id } = useParams<{ id: string }>();
  return <Redirect to={`/admin/site/pages/${id ?? ""}`} />;
}

function wrap(page: React.ReactNode) {
  return <AdminShell>{page}</AdminShell>;
}

export default function AdminRouter() {
  const { isAdmin, isLoading } = useAdmin();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-muted-foreground">
        Authenticating…
      </div>
    );
  }

  return (
    <Suspense fallback={<AdminPageFallback />}>
      <Switch>
        <Route path="/admin/login">
          {isAdmin ? <Redirect to="/admin" /> : <AdminLogin />}
        </Route>

        {!isAdmin && <Route><Redirect to="/admin/login" /></Route>}

        <Route path="/admin">{wrap(<AdminDashboard />)}</Route>

        <Route path="/admin/leads/new">{wrap(<LeadNew />)}</Route>
        <Route path="/admin/leads/kanban">{wrap(<LeadsKanban />)}</Route>
        <Route path="/admin/leads/:id">{wrap(<LeadDetail />)}</Route>
        <Route path="/admin/leads">{wrap(<LeadsList />)}</Route>

        <Route path="/admin/content/:collection/:id">{wrap(<CollectionEdit />)}</Route>
        <Route path="/admin/content/:collection">{wrap(<CollectionList />)}</Route>

        <Route path="/admin/site/seo">{wrap(<SeoManager />)}</Route>
        <Route path="/admin/site/site-blocks">{wrap(<SiteBlocksEditor />)}</Route>
        <Route path="/admin/site/site-page">{wrap(<SitePageEdit />)}</Route>
        <Route path="/admin/site/pages/:id">{wrap(<PageEdit />)}</Route>
        <Route path="/admin/site/pages">{wrap(<PagesList />)}</Route>

        <Route path="/admin/system/automation">{wrap(<AdminAutomation />)}</Route>
        <Route path="/admin/system/integrations">{wrap(<AdminIntegrations />)}</Route>
        <Route path="/admin/system/activity">{wrap(<AdminActivity />)}</Route>
        <Route path="/admin/system/users">{wrap(<AdminUsers />)}</Route>
        <Route path="/admin/system/settings">{wrap(<AdminSettings />)}</Route>

        <Route path="/admin/media">{wrap(<MediaLibrary />)}</Route>

        <Route path="/admin/seo"><Redirect to="/admin/site/seo" /></Route>
        <Route path="/admin/settings"><Redirect to="/admin/system/settings" /></Route>
        <Route path="/admin/site-blocks"><Redirect to="/admin/site/site-blocks" /></Route>
        <Route path="/admin/site-page"><Redirect to="/admin/site/site-page" /></Route>
        <Route path="/admin/pages/:id">{wrap(<LegacyPageEditRedirect />)}</Route>
        <Route path="/admin/pages"><Redirect to="/admin/site/pages" /></Route>

        <Route path="/admin/:collection/:id">{wrap(<LegacyCollectionRedirect />)}</Route>
        <Route path="/admin/:collection">{wrap(<LegacyCollectionRedirect />)}</Route>
      </Switch>
    </Suspense>
  );
}
