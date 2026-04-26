import { Seo } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { GitBranch, Workflow, Cpu, Zap, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

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
        title="Business Automation Services" 
        description="Eliminate manual chaos. We build intelligent workflows and integrations that connect your tools and automate repeatable processes."
      />
      
      <section className="py-24 bg-primary text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.2)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px]" />
        <div className="container relative mx-auto px-4 md:px-6">
          <div className="max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-medium mb-8 border border-accent/20"
            >
              <Zap className="w-4 h-4" /> Stop doing robot work
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              Business Automation
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-primary-foreground/80 mb-8 leading-relaxed"
            >
              If a human is copying data from one screen to another, your business is leaking margin. We engineer flawless, automated data pipelines that run quietly in the background, 24/7.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Link href="/contact">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full">
                  Discuss Your Automation Strategy
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {automations.map((auto, i) => (
              <div key={i} className="bg-card border border-border p-8 rounded-3xl">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary mb-6">
                  <auto.icon size={24} />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-4">{auto.title}</h3>
                <p className="text-muted-foreground mb-6">{auto.desc}</p>
                <div className="pt-6 border-t border-border mt-auto">
                  <p className="text-sm font-semibold text-primary mb-2">Common Deployments:</p>
                  <p className="text-sm text-muted-foreground">{auto.examples}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-muted/30 border-y border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mb-16 text-center mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-primary mb-6">Anatomy of a Perfect Automation</h2>
            <p className="text-lg text-muted-foreground">
              We don't just connect tools; we architect resilient systems that handle errors gracefully and scale infinitely.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {[
                { title: "Audit & Process Mapping", desc: "We document every manual touchpoint, system dependency, and edge case before writing a single script." },
                { title: "Middleware Architecture", desc: "We select the right integration layer—whether Zapier, Make, n8n, or a custom Node.js service—based on volume and security requirements." },
                { title: "Error Handling & Logging", desc: "Our automations don't silently fail. We build robust error catching and alerts so you know exactly when an API goes down." },
                { title: "Testing & Handover", desc: "Rigorous testing in sandbox environments, followed by comprehensive documentation handed over to your team." }
              ].map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="mt-1">
                    <CheckCircle2 className="text-secondary w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-primary mb-1">{step.title}</h3>
                    <p className="text-muted-foreground">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-card border border-border p-8 rounded-3xl relative overflow-hidden shadow-sm h-full flex flex-col justify-center">
               {/* Abstract Flow Diagram Placeholder */}
               <div className="flex flex-col gap-6 items-center w-full">
                  <div className="w-full max-w-[200px] p-4 bg-primary text-white text-center rounded-lg font-medium border border-primary-foreground/20 shadow-md z-10">New Closed Won Deal</div>
                  <div className="h-8 w-0.5 bg-border border-dashed relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rotate-45 border-b border-r border-border"></div>
                  </div>
                  
                  <div className="w-full flex gap-4 justify-center items-center relative">
                    <div className="w-full absolute top-1/2 left-0 h-0.5 bg-border border-dashed -z-0"></div>
                    <div className="flex-1 max-w-[160px] p-4 bg-card text-primary text-center rounded-lg font-medium border border-border shadow-sm z-10 text-sm">Create Invoice in ERP</div>
                    <div className="flex-1 max-w-[160px] p-4 bg-card text-primary text-center rounded-lg font-medium border border-border shadow-sm z-10 text-sm">Provision Client Account</div>
                  </div>

                  <div className="h-8 w-0.5 bg-border border-dashed relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rotate-45 border-b border-r border-border"></div>
                  </div>
                  <div className="w-full max-w-[200px] p-4 bg-secondary text-white text-center rounded-lg font-medium border border-secondary/20 shadow-md z-10">Send Onboarding Welcome</div>
               </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 text-center">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-primary mb-8">Ready to automate your operations?</h2>
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
