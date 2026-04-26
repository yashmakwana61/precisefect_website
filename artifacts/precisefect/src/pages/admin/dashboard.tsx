import { Link } from "wouter";
import { ArrowRight, FileText, Briefcase, HelpCircle, Users, Building2, Quote } from "lucide-react";
import type { CollectionName } from "@/lib/cms-api";

const COLLECTIONS: {
  slug: CollectionName;
  name: string;
  description: string;
  icon: typeof FileText;
}[] = [
  { slug: "blog-posts", name: "Blog Posts", description: "Field notes, technical essays, and architectural insights.", icon: FileText },
  { slug: "case-studies", name: "Case Studies", description: "Client outcomes with metrics, problem, solution, and results.", icon: Building2 },
  { slug: "faqs", name: "FAQs", description: "Operational protocol questions answered for prospects.", icon: HelpCircle },
  { slug: "team-members", name: "Team", description: "The engineers, architects, and operators behind the firm.", icon: Users },
  { slug: "job-openings", name: "Careers", description: "Open positions and engineering roles.", icon: Briefcase },
  { slug: "testimonials", name: "Testimonials", description: "Quoted endorsements from clients.", icon: Quote },
];

export default function AdminDashboard() {
  return (
    <div className="max-w-[1440px] mx-auto px-8 lg:px-16 py-24">
      <div className="mb-16">
        <p className="text-xs font-bold text-on-primary-container tracking-[0.2em] uppercase mb-4">
          Operational Console
        </p>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-primary mb-6 leading-[0.95]">
          Content <span className="text-on-primary-container">Architecture.</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Manage every collection rendered on the public website. Changes propagate immediately upon save.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {COLLECTIONS.map((c) => (
          <Link
            key={c.slug}
            href={`/admin/${c.slug}`}
            data-testid={`link-collection-${c.slug}`}
            className="group block bg-surface-container-lowest ghost-border rounded-xl p-8 hover:-translate-y-1 hover:shadow-xl transition-all"
          >
            <c.icon className="w-8 h-8 text-primary mb-6 stroke-[1.5]" />
            <h2 className="text-xl font-bold text-primary mb-3 group-hover:text-primary-container transition-colors tracking-tight">
              {c.name}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-8">
              {c.description}
            </p>
            <div className="flex items-center text-xs font-bold text-primary tracking-[0.15em] uppercase">
              Manage <ArrowRight className="ml-2 w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
