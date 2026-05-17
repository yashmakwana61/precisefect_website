import { Seo } from "@/components/seo";
import { Link } from "wouter";
import { GitBranch, Workflow, Cpu, Zap, ArrowRight, CheckCircle2 } from "lucide-react";
import DataStream from "@/components/canvas/DataStream";
import { HeroCanvasFrame } from "@/components/motion/hero-canvas-frame";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/motion/section-heading";
import { heroCopy, heroVisualCentered, itemReveal, sectionReveal } from "@/lib/motion-presets";

export default function ServicesAutomation() {
  const automations = [
    {
      icon: GitBranch,
      title: "Workflow Automation",
      desc: "Connect your existing software stack to eliminate manual data entry. We build resilient pipelines across your CRM, accounting, and operational tools.",
      examples: "Quote to Cash, Lead Routing, Inventory Sync"
    },
    {
      icon: Cpu,
      title: "AI Process Optimization",
      desc: "Deploy intelligent models to handle unstructured data. Automate invoice processing, email classification, and customer support triage securely.",
      examples: "Document Parsing, Sentiment Routing, Smart Drafting"
    },
    {
      icon: Workflow,
      title: "Custom Integrations",
      desc: "When native integrations fail, we build robust API bridges between legacy on-premise systems and modern cloud infrastructure.",
      examples: "ERP to E-commerce, EDI to API, Webhook Management"
    }
  ];

  return (
    <>
      <Seo 
        title="Middleware Automation Architecture | Precisefect" 
        description="Eradicate manual chaos. We build intelligent workflows and integrations that connect your tools and automate repeatable processes."
      />
      
      <section className="py-24 md:py-32 bg-surface relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div {...heroCopy}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tertiary-container text-on-tertiary-container text-xs font-bold uppercase tracking-widest mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-on-tertiary-container" />
              Autonomous Orchestration
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-primary mb-8 leading-[0.95]">
              Middleware <br />
              <span className="text-on-primary-container">Automation.</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-12 max-w-xl">
              If a human is copying data from one screen to another, your business is leaking margin. We engineer flawless, automated data pipelines that run quietly in the background, 24/7.
            </p>
            <Link href="/contact">
              <button className="signature-gradient text-white font-bold rounded-lg px-10 py-5 shadow-md btn-press text-lg">
                Submit RFP
              </button>
            </Link>
          </motion.div>

          <motion.div
            {...heroVisualCentered}
            className="relative w-full aspect-video lg:aspect-square max-w-[600px] ml-auto min-h-[280px]"
          >
            <HeroCanvasFrame>
              <DataStream intensity="light" />            </HeroCanvasFrame>
          </motion.div>
        </div>
      </section>

      <section className="py-32 bg-surface-container-lowest border-y border-border">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <SectionHeading eyebrow="Structural Capabilities" title="Integration Vectors" />
          
          <div className="grid md:grid-cols-3 gap-8">
            {automations.map((auto, i) => (
              <motion.div
                key={i}
                {...itemReveal(i)}
                className="bg-surface ghost-border p-10 rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col group"
              >
                <auto.icon className="w-10 h-10 text-primary mb-8 stroke-[1.5]" />
                <h3 className="text-2xl font-bold text-primary mb-4">{auto.title}</h3>
                <p className="text-muted-foreground mb-8 flex-grow leading-relaxed">{auto.desc}</p>
                <div className="pt-6 border-t border-border mt-auto">
                  <p className="text-xs font-bold text-on-primary-container uppercase tracking-widest mb-2">Common Deployments</p>
                  <p className="text-sm text-muted-foreground font-medium">{auto.examples}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 bg-surface">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <SectionHeading
            eyebrow="System Resilience"
            title="Anatomy of a Perfect Automation"
            description="We don't just connect tools; we architect resilient middleware that handles errors gracefully and scales infinitely."
            centered
            className="mb-20 text-center mx-auto max-w-3xl"
          />

          <motion.div className="max-w-4xl mx-auto space-y-12" {...sectionReveal()}>
            {[
              { step: "1", title: "Audit & Process Mapping", desc: "We document every manual touchpoint, system dependency, and edge case before writing a single script or configuring a node." },
              { step: "2", title: "Middleware Architecture", desc: "We select the right integration layer—whether Make, n8n, or a custom Node.js microservice—based on volume, compliance, and security." },
              { step: "3", title: "Error Handling & Telemetry", desc: "Our automations don't silently fail. We build robust error catching and alerts so you know exactly when a 3rd-party API degrades." },
              { step: "4", title: "Testing & Handover", desc: "Rigorous testing in sandbox environments, followed by comprehensive documentation handed over to your internal stakeholders." }
            ].map((phase) => (
              <div key={phase.step} className="flex gap-8">
                <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">{phase.step}</div>
                <div>
                  <h3 className="text-2xl font-bold text-primary mb-3">{phase.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">{phase.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}
