import { lazy, Suspense } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { pageTransition } from "@/lib/motion-presets";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout";

const Home = lazy(() => import("@/pages/home"));
const About = lazy(() => import("@/pages/about"));
const Services = lazy(() => import("@/pages/services"));
const ServicesErp = lazy(() => import("@/pages/services-erp"));
const ServicesAutomation = lazy(() => import("@/pages/services-automation"));
const Industries = lazy(() => import("@/pages/industries"));
const CaseStudies = lazy(() => import("@/pages/case-studies"));
const Pricing = lazy(() => import("@/pages/pricing"));
const Blog = lazy(() => import("@/pages/blog"));
const BlogPostPage = lazy(() => import("@/pages/blog-post"));
const Contact = lazy(() => import("@/pages/contact"));
const Faq = lazy(() => import("@/pages/faq"));
const Careers = lazy(() => import("@/pages/careers"));
const CustomPageRenderer = lazy(() => import("@/pages/custom-page"));
const NotFound = lazy(() => import("@/pages/not-found"));
const AdminRouter = lazy(() => import("@/pages/admin"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function PageFallback() {
  return (
    <motion.div
      className="flex-grow min-h-[40vh] flex items-center justify-center text-muted-foreground"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      Loading…
    </motion.div>
  );
}

function PublicSite() {
  const [location] = useLocation();

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <motion.div key={location} className="flex flex-col flex-grow" {...pageTransition}>
          <Suspense fallback={<PageFallback />}>
            <Switch location={location}>
              <Route path="/" component={Home} />
              <Route path="/about" component={About} />
              <Route path="/services" component={Services} />
              <Route path="/services/erp" component={ServicesErp} />
              <Route path="/services/automation" component={ServicesAutomation} />
              <Route path="/industries" component={Industries} />
              <Route path="/case-studies" component={CaseStudies} />
              <Route path="/pricing" component={Pricing} />
              <Route path="/blog" component={Blog} />
              <Route path="/blog/:slug" component={BlogPostPage} />
              <Route path="/contact" component={Contact} />
              <Route path="/faq" component={Faq} />
              <Route path="/careers" component={Careers} />
              <Route path="/p/:slug" component={CustomPageRenderer} />
              <Route component={NotFound} />
            </Switch>
          </Suspense>
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
}

function Router() {
  const [location] = useLocation();
  if (location.startsWith("/admin")) {
    return (
      <Suspense fallback={<PageFallback />}>
        <AdminRouter />
      </Suspense>
    );
  }
  return <PublicSite />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
