import { Seo } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Check } from "lucide-react";

export default function Pricing() {
  const plans = [
    {
      name: "Automation Sprint",
      target: "For specific workflow bottlenecks",
      price: "Starting at $5k",
      desc: "Targeted automation of 1-3 critical business workflows to deliver immediate ROI and eliminate manual data entry in a specific department.",
      features: [
        "Process mapping for up to 3 workflows",
        "Integration of up to 5 existing tools",
        "Middleware setup (Make/Zapier/Custom)",
        "Error handling & alerting configuration",
        "2 weeks of post-launch hypercare",
        "Detailed documentation & training"
      ],
      cta: "Discuss Your Workflows",
      featured: false
    },
    {
      name: "ERP Implementation",
      target: "For systemic operational overhauls",
      price: "Custom Scoped",
      desc: "End-to-end architecture, configuration, and deployment of a unified ERP system tailored to your unique business model.",
      features: [
        "Comprehensive business blueprinting",
        "ERPNext, Odoo, or Zoho configuration",
        "Legacy data cleansing and migration",
        "Custom module development if needed",
        "Role-based security architecture",
        "Rigorous UAT and phased rollout",
        "On-site or remote team training"
      ],
      cta: "Schedule an ERP Assessment",
      featured: true
    },
    {
      name: "Retained Engineering",
      target: "For ongoing optimization & support",
      price: "Starting at $3k / mo",
      desc: "A dedicated engineering partner to continuously optimize your systems, build new automations as you grow, and provide priority support.",
      features: [
        "Guaranteed monthly engineering hours",
        "Priority SLA for critical system issues",
        "Continuous workflow optimization",
        "New API integrations on demand",
        "Quarterly strategic technology reviews",
        "Direct access to principal architects"
      ],
      cta: "Explore Retainer Options",
      featured: false
    }
  ];

  return (
    <>
      <Seo 
        title="Pricing & Engagements | Precisefect" 
        description="We bill by the project and the value delivered, not by the hour. View our typical engagement models for ERP and Automation."
      />
      
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">Investment Models</h1>
            <p className="text-xl text-muted-foreground">
              We are a premium consultancy. We don't do hourly billing surprises. We scope accurately, price based on value, and deliver engineered outcomes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, i) => (
              <div 
                key={i} 
                className={`relative flex flex-col p-8 rounded-3xl border ${
                  plan.featured 
                    ? "bg-primary text-white border-primary shadow-xl md:-translate-y-4" 
                    : "bg-card text-foreground border-border hover:border-primary/20 transition-colors"
                }`}
              >
                {plan.featured && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent text-accent-foreground text-xs font-bold px-4 py-1 rounded-full uppercase tracking-widest">
                    Most Common
                  </div>
                )}
                
                <div className="mb-6">
                  <h3 className={`text-2xl font-bold mb-1 ${plan.featured ? "text-white" : "text-primary"}`}>{plan.name}</h3>
                  <p className={`text-sm ${plan.featured ? "text-white/70" : "text-muted-foreground"}`}>{plan.target}</p>
                </div>
                
                <div className="mb-6 pb-6 border-b border-white/10 dark:border-border">
                  <div className={`text-3xl font-bold mb-2 ${plan.featured ? "text-white" : "text-primary"}`}>{plan.price}</div>
                  <p className={`text-sm leading-relaxed ${plan.featured ? "text-white/80" : "text-muted-foreground"}`}>{plan.desc}</p>
                </div>
                
                <ul className="space-y-4 mb-8 flex-grow">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex gap-3 text-sm">
                      <Check className={`w-5 h-5 shrink-0 ${plan.featured ? "text-accent" : "text-secondary"}`} />
                      <span className={plan.featured ? "text-white/90" : "text-muted-foreground"}>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link href="/contact" className="w-full mt-auto">
                  <Button 
                    className={`w-full rounded-full h-12 ${
                      plan.featured 
                        ? "bg-accent hover:bg-accent/90 text-accent-foreground" 
                        : "bg-secondary/10 hover:bg-secondary/20 text-secondary"
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-muted/30 border-y border-border">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <h2 className="text-3xl font-bold text-primary mb-12 text-center">Engagement FAQ</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold text-primary mb-2">Do you charge hourly?</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">Rarely. We strongly prefer fixed-bid projects based on a thoroughly defined scope. It aligns our incentives: you get predictable costs, and we are incentivized to build efficiently.</p>
            </div>
            <div>
              <h4 className="font-bold text-primary mb-2">How do you handle scope changes?</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">If you need new features mid-project, we submit a formal change order with the associated cost and timeline impact before proceeding. No surprise invoices, ever.</p>
            </div>
            <div>
              <h4 className="font-bold text-primary mb-2">What about software licensing costs?</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">Our implementation fees do not include the underlying software licenses (e.g., Zoho or Odoo subscriptions), which you will pay directly to the vendor to maintain ownership.</p>
            </div>
            <div>
              <h4 className="font-bold text-primary mb-2">Do you offer post-launch support?</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">Yes. Every project includes a hypercare period immediately after launch. Long-term support is available via our Retained Engineering agreements.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
