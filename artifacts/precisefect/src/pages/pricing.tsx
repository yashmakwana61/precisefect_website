import { Seo } from "@/components/seo";
import { Link } from "wouter";
import { Check, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/motion/section-heading";
import NodeGraph from "@/components/canvas/NodeGraph";
import { HeroCanvasFrame } from "@/components/motion/hero-canvas-frame";
import { heroCopy, heroVisualCentered, mountReveal, sectionReveal } from "@/lib/motion-presets";

export default function Pricing() {
  const plans = [
    {
      name: "Automation Sprint",
      target: "Targeted workflow decouping",
      price: "Starting at $5k",
      desc: "Targeted automation of 1-3 critical business workflows to deliver immediate ROI and eliminate manual data entry in a specific department.",
      features: [
        "Process mapping for up to 3 workflows",
        "Integration of up to 5 existing tools",
        "Middleware architecture (Make/n8n/Custom)",
        "Error handling & telemetry configuration",
        "2 weeks of post-launch hypercare",
        "Detailed documentation & training"
      ],
      cta: "Discuss Workflows",
      featured: false
    },
    {
      name: "ERP Architecture",
      target: "Systemic operational overhaul",
      price: "Custom Scoped",
      desc: "End-to-end architecture, configuration, and deployment of a unified ERP system tailored to your unique business physics.",
      features: [
        "Comprehensive business blueprinting",
        "ERPNext, Odoo, or Zoho configuration",
        "Legacy data extraction & ETL migration",
        "Custom module development if needed",
        "Role-based security architecture",
        "Rigorous UAT and phased rollout",
        "On-site or remote team training"
      ],
      cta: "Schedule Assessment",
      featured: true
    },
    {
      name: "Retained Engineering",
      target: "Continuous system optimization",
      price: "Starting at $3k / mo",
      desc: "A dedicated engineering partner to continuously optimize your systems, build new automations as you scale, and provide priority SLA.",
      features: [
        "Guaranteed monthly engineering hours",
        "Priority SLA for critical system issues",
        "Continuous workflow optimization",
        "New API integrations on demand",
        "Quarterly strategic technology reviews",
        "Direct access to principal architects"
      ],
      cta: "Explore Retainers",
      featured: false
    }
  ];

  return (
    <>
      <Seo 
        title="Engagement Models | Precisefect" 
        description="We bill by the project and the value delivered, not by the hour. View our typical engagement models for ERP and Automation."
      />
      
      <section className="py-24 md:py-32 bg-surface relative overflow-hidden">
        <motion.div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
            <motion.div {...heroCopy}>
              <p className="text-xs font-bold text-on-primary-container tracking-[0.2em] uppercase mb-4">Engagement Models</p>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-primary mb-8 leading-[0.95]">
                Structural <br />
                <span className="text-on-primary-container">Investment.</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                We are a premium consultancy. We do not engage in hourly billing surprises. We scope accurately, price based on structural value delivered, and execute flawlessly.
              </p>
            </motion.div>
            <motion.div {...heroVisualCentered} className="relative w-full aspect-video lg:aspect-square max-w-[600px] ml-auto min-h-[280px]">
              <HeroCanvasFrame>
                <NodeGraph variant="hub" className="opacity-95" />              </HeroCanvasFrame>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto text-left">
            {plans.map((plan, i) => (
              <motion.div
                {...mountReveal(i * 0.08)}
                key={i} 
                className={`relative flex flex-col p-10 rounded-xl ${
                  plan.featured 
                    ? "bg-primary text-white shadow-2xl md:-translate-y-4" 
                    : "bg-surface-container-lowest text-foreground ghost-border hover:-translate-y-1 transition-transform"
                }`}
              >
                {plan.featured && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-tertiary-container text-on-tertiary-container text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">
                    Primary Protocol
                  </div>
                )}
                
                <div className="mb-8">
                  <h3 className={`text-2xl font-bold mb-2 ${plan.featured ? "text-white" : "text-primary"}`}>{plan.name}</h3>
                  <p className={`text-sm font-medium ${plan.featured ? "text-on-primary-container" : "text-muted-foreground"}`}>{plan.target}</p>
                </div>
                
                <div className="mb-8 pb-8 border-b border-border/10 dark:border-border">
                  <div className={`text-3xl tracking-tight font-bold mb-4 ${plan.featured ? "text-white" : "text-primary"}`}>{plan.price}</div>
                  <p className={`text-sm leading-relaxed ${plan.featured ? "text-white/80" : "text-muted-foreground"}`}>{plan.desc}</p>
                </div>
                
                <ul className="space-y-5 mb-10 flex-grow">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex gap-4 text-sm font-medium">
                      <Check className={`w-5 h-5 shrink-0 ${plan.featured ? "text-on-primary-container" : "text-primary"}`} />
                      <span className={plan.featured ? "text-white/90" : "text-muted-foreground"}>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link href="/contact" className="w-full mt-auto">
                  <button 
                    className={`w-full rounded-lg h-14 font-bold text-sm btn-press ${
                      plan.featured 
                        ? "bg-white text-primary" 
                        : "bg-surface-container-high text-primary hover:bg-primary-container hover:text-white transition-colors"
                    }`}
                  >
                    {plan.cta}
                  </button>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="py-32 bg-surface-container-lowest border-y border-border">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16 max-w-4xl">
          <SectionHeading
            eyebrow="Protocol Parameters"
            title="Engagement Variables"
            centered
            className="mb-16 text-center"
          />
          
          <motion.div className="grid md:grid-cols-2 gap-12" {...sectionReveal()}>
            <motion.div>
              <h4 className="font-bold text-primary mb-3">Do you charge hourly?</h4>
              <p className="text-muted-foreground leading-relaxed">Rarely. We strongly prefer fixed-bid projects based on a thoroughly defined scope. It aligns our incentives: you get predictable costs, and we are incentivized to build efficiently.</p>
            </motion.div>
            <motion.div>
              <h4 className="font-bold text-primary mb-3">How do you handle scope changes?</h4>
              <p className="text-muted-foreground leading-relaxed">If you need new architectural features mid-project, we submit a formal change order with the associated cost and timeline impact before proceeding. No surprise invoices, ever.</p>
            </motion.div>
            <motion.div>
              <h4 className="font-bold text-primary mb-3">What about software licensing costs?</h4>
              <p className="text-muted-foreground leading-relaxed">Our engineering fees do not include the underlying software licenses (e.g., Zoho or Odoo subscriptions), which you will pay directly to the vendor to maintain total ownership.</p>
            </motion.div>
            <motion.div>
              <h4 className="font-bold text-primary mb-3">Do you offer post-launch support?</h4>
              <p className="text-muted-foreground leading-relaxed">Yes. Every deployment includes a hypercare period immediately after launch. Long-term structural support is available via our Retained Engineering agreements.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

