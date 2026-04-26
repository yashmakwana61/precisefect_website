import { Seo } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function ServicesErp() {
  return (
    <>
      <Seo 
        title="ERP Implementation Services" 
        description="Expert implementation for ERPNext, Odoo, and Zoho. Unify your data, streamline operations, and prepare for scale."
      />
      
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">ERP Solutions</h1>
            <p className="text-xl text-muted-foreground mb-8">
              A single source of truth for your entire business. We design, configure, and deploy robust ERP systems that eliminate data silos and manual reconciliation.
            </p>
            <Link href="/contact">
              <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white rounded-full">
                Discuss Your ERP Needs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-primary mb-16 text-center">Systems We Master</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "ERPNext",
                desc: "An incredibly agile, open-source platform perfect for manufacturing, retail, and services. Highly customizable without vendor lock-in.",
              },
              {
                name: "Odoo",
                desc: "A comprehensive suite of business apps that seamlessly integrate. Ideal for companies needing a modular approach to growth.",
              },
              {
                name: "Zoho One",
                desc: "The operating system for business. Best for organizations heavily focused on sales, marketing, and robust CRM capabilities integrated with finance.",
              }
            ].map((sys, i) => (
              <div key={i} className="p-8 border border-border rounded-3xl bg-card">
                <h3 className="text-2xl font-bold text-primary mb-4">{sys.name}</h3>
                <p className="text-muted-foreground">{sys.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-primary text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Why ERP Implementations Fail (And How We Succeed)</h2>
              <p className="text-primary-foreground/80 text-lg mb-8">
                70% of ERP projects go over budget or fail entirely. They fail because agencies treat them as IT projects, not business transformations. We map the business logic first, write code second.
              </p>
              <ul className="space-y-4">
                {[
                  "Process mapping before configuration",
                  "Phased rollouts to minimize operational risk",
                  "Rigorous user acceptance testing",
                  "Comprehensive team training and documentation"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="text-accent w-6 h-6 shrink-0" />
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
              <h3 className="text-xl font-bold mb-4">Implementation Timeline</h3>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/20 before:to-transparent">
                {[
                  { step: "Phase 1", title: "Discovery & Blueprinting", duration: "2-4 Weeks" },
                  { step: "Phase 2", title: "Configuration & Customization", duration: "4-8 Weeks" },
                  { step: "Phase 3", title: "Data Migration & Testing", duration: "3-5 Weeks" },
                  { step: "Phase 4", title: "Training & Go-Live", duration: "2-4 Weeks" }
                ].map((phase, i) => (
                  <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-primary bg-accent shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow"></div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-white/10 bg-white/5">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-accent text-sm">{phase.step}</span>
                        <span className="text-xs text-white/50">{phase.duration}</span>
                      </div>
                      <h4 className="font-semibold">{phase.title}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 text-center">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-primary mb-8">Ready to build your single source of truth?</h2>
          <Link href="/contact">
            <Button size="lg" className="bg-primary text-white rounded-full">
              Get Started <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
