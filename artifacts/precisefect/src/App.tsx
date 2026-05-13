import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout";

import Home from "@/pages/home";
import About from "@/pages/about";
import Services from "@/pages/services";
import ServicesErp from "@/pages/services-erp";
import ServicesAutomation from "@/pages/services-automation";
import Industries from "@/pages/industries";
import CaseStudies from "@/pages/case-studies";
import Pricing from "@/pages/pricing";
import Blog from "@/pages/blog";
import BlogPostPage from "@/pages/blog-post";
import Contact from "@/pages/contact";
import Faq from "@/pages/faq";
import Careers from "@/pages/careers";
import CustomPageRenderer from "@/pages/custom-page";
import NotFound from "@/pages/not-found";
import AdminRouter from "@/pages/admin";

const queryClient = new QueryClient();

function PublicSite() {
  return (
    <Layout>
      <Switch>
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
    </Layout>
  );
}

function Router() {
  const [location] = useLocation();
  if (location.startsWith("/admin")) return <AdminRouter />;
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
