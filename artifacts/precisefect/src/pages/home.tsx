import { Seo } from "@/components/seo";
import { Link } from "wouter";
import { ArrowRight, Database, Zap, Network, LayoutGrid } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <>
      <Seo 
        title="ERP & Automation Architecture" 
        description="Precisefect engineers operational perfection for scaling enterprises. Eradicate manual chaos."
      />
      
      {/* Hero Section */}
      <section className="py-24 bg-surface relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-start"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tertiary-container text-on-tertiary-container text-xs font-bold uppercase tracking-widest mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-on-tertiary-container" />
              Operational Alpha
            </div>
            
            <h1 className="text-6xl lg:text-7xl xl:text-8xl font-bold tracking-[-0.03em] text-primary mb-8 leading-[0.95]">
              Architecting <br />
              <span className="text-on-primary-container">Perfection.</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-xl mb-12 leading-relaxed">
              We engineer robust operational systems using cutting-edge ERP and automation middleware. Eliminate manual entropy, unify your data, and scale your business without scaling headcount.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <Link href="/contact">
                <button className="signature-gradient text-white font-bold rounded-lg px-10 py-5 shadow-md btn-press text-lg">
                  Submit RFP
                </button>
              </Link>
              <Link href="/case-studies" className="group flex items-center text-primary font-bold text-lg hover:text-primary-container transition-colors">
                Examine The Proof <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-2" />
              </Link>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative w-full aspect-square max-w-[600px] mx-auto lg:ml-auto"
          >
            <div className="absolute -inset-4 bg-primary-container/20 rounded-full blur-[120px] -z-10" />
            <div className="w-full h-full bg-surface-container-lowest ghost-border p-4 rounded-xl shadow-2xl relative overflow-hidden group">
              <div className="w-full h-full bg-surface-container-high rounded-lg relative overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700 flex flex-col">
                {/* Abstract Data Visualization */}
                <div className="flex-1 border-b border-border p-8 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:2rem_2rem]" />
                  <div className="w-full h-full flex flex-col gap-4 relative z-10 justify-center">
                    <div className="w-3/4 h-8 bg-primary rounded-sm opacity-90" />
                    <div className="w-1/2 h-8 bg-on-primary-container rounded-sm opacity-80" />
                    <div className="w-5/6 h-8 bg-primary-container rounded-sm opacity-70" />
                  </div>
                </div>
                <div className="h-24 bg-surface p-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-tertiary-container" />
                    <span className="text-xs font-bold text-primary tracking-widest uppercase">System Nominal</span>
                  </div>
                  <div className="text-xs font-mono text-muted-foreground">latency: 12ms</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-16 bg-surface-container-lowest border-y border-border">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <p className="text-xs font-bold text-on-primary-container tracking-[0.2em] uppercase mb-8">Trusted by Operational Leaders</p>
          <div className="flex flex-wrap gap-12 md:gap-24 opacity-60 grayscale">
            {["Nexus Manufacturing", "Aura Logistics", "Veridian Retail", "Quantis Pharma"].map((name) => (
              <div key={name} className="text-xl md:text-2xl font-black tracking-tighter text-primary uppercase">
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Problem / Solution Pattern */}
      <section className="py-32 bg-surface">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <div className="mb-20">
            <p className="text-xs font-bold text-on-primary-container tracking-[0.2em] uppercase mb-4">The Entropy Crisis</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-primary mb-6 max-w-3xl">
              Spreadsheets fracture. <br/>Data degrades. Systems halt.
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Manual workflows create structural vulnerability. We architect centralized data cores and automated pipelines designed for serious resilience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-16">
            {[
              { icon: Database, title: "Unified Core Design", desc: "A singular, immutable source of truth for inventory, finance, and CRM. Eradicate data reconciliation." },
              { icon: Zap, title: "Autonomous Orchestration", desc: "If an action is repeatable, we automate it. Reclaim thousands of hours previously lost to manual data entry." },
              { icon: Network, title: "Telemetry & Vision", desc: "Real-time operational dashboards. Steer the enterprise based on current physics, not last month's reports." }
            ].map((feature, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                key={i} 
                className="flex flex-col"
              >
                <feature.icon className="w-10 h-10 text-primary mb-6 stroke-[1.5]" />
                <h3 className="text-xl font-bold text-primary mb-4">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-32 bg-surface-container-low">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div>
              <p className="text-xs font-bold text-on-primary-container tracking-[0.2em] uppercase mb-4">Core Competencies</p>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-primary">Symmetry in Motion.</h2>
            </div>
            <Link href="/services" className="group flex items-center text-primary font-bold hover:text-primary-container transition-colors">
              All Competencies <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-2" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Link href="/services/erp" className="group block">
              <div className="bg-surface-container-lowest ghost-border p-10 rounded-xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col">
                <LayoutGrid className="w-10 h-10 text-primary mb-8 stroke-[1.5]" />
                <h3 className="text-2xl font-bold text-primary mb-4">ERP Architecture</h3>
                <p className="text-muted-foreground mb-12 flex-grow max-w-md">We design and deploy monolithic ERP environments (ERPNext, Odoo, Zoho) calibrated precisely to your operational model.</p>
                <div className="text-sm font-bold text-primary flex items-center mt-auto">
                  Examine Methodology <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-2" />
                </div>
              </div>
            </Link>
            
            <Link href="/services/automation" className="group block">
              <div className="bg-primary border border-primary-container p-10 rounded-xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container rounded-full blur-[80px] -z-10" />
                <Zap className="w-10 h-10 text-surface mb-8 stroke-[1.5]" />
                <h3 className="text-2xl font-bold text-surface mb-4">Middleware Automation</h3>
                <p className="text-surface/70 mb-12 flex-grow max-w-md">Custom API layers and workflow automations that bridge legacy systems and eliminate manual data handling entirely.</p>
                <div className="text-sm font-bold text-surface flex items-center mt-auto">
                  Examine Methodology <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-2" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-surface text-center">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16 max-w-3xl">
          <p className="text-xs font-bold text-on-primary-container tracking-[0.2em] uppercase mb-6">Initiate Protocol</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-primary mb-8">Ready to engineer your operations?</h2>
          <p className="text-lg text-muted-foreground mb-12">Stop treating the symptoms. Let's fix the underlying architecture.</p>
          <Link href="/contact">
            <button className="signature-gradient text-white font-bold rounded-lg px-12 py-5 shadow-md btn-press text-lg">
              Schedule Architectural Review
            </button>
          </Link>
        </div>
      </section>
    </>
  );
}
