import { Seo } from "@/components/seo";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Database } from "lucide-react";

export default function ServicesErp() {
  return (
    <>
      <Seo 
        title="ERP Architecture & Implementation" 
        description="Expert implementation for ERPNext, Odoo, and Zoho. Unify your data and prepare for scale."
      />
      
      <section className="py-24 md:py-32 bg-surface relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tertiary-container text-on-tertiary-container text-xs font-bold uppercase tracking-widest mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-on-tertiary-container" />
              Unified Data Core
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-primary mb-8 leading-[0.95]">
              ERP Architecture
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-12 max-w-xl">
              A singular, immutable source of truth. We engineer robust ERP environments that eradicate data silos and manual reconciliation.
            </p>
            <Link href="/contact">
              <button className="signature-gradient text-white font-bold rounded-lg px-10 py-5 shadow-md btn-press text-lg">
                Submit RFP
              </button>
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative w-full aspect-video lg:aspect-square max-w-[600px] ml-auto"
          >
            <div className="absolute -inset-4 bg-primary-container/20 rounded-full blur-[120px] -z-10" />
            <div className="w-full h-full bg-surface-container-lowest ghost-border p-4 rounded-xl shadow-xl">
               <div className="w-full h-full bg-surface-container-base rounded-lg border border-border p-8 flex flex-col justify-center gap-4">
                  <div className="w-full h-12 bg-primary rounded shadow-sm" />
                  <div className="w-3/4 h-12 bg-on-primary-container rounded shadow-sm" />
                  <div className="w-1/2 h-12 bg-primary-container rounded shadow-sm" />
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-32 bg-surface-container-lowest border-y border-border">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <div className="mb-20">
            <p className="text-xs font-bold text-on-primary-container tracking-[0.2em] uppercase mb-4">Supported Frameworks</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-primary">Systems We Master</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "ERPNext",
                desc: "A highly agile, open-source monolith perfect for industrial manufacturing. Extensible without vendor lock-in.",
              },
              {
                name: "Odoo",
                desc: "A modular ecosystem of enterprise applications. Ideal for organizations seeking a phased integration approach.",
              },
              {
                name: "Zoho One",
                desc: "The operating system for business. Engineered for organizations with demanding CRM and marketing workflows.",
              }
            ].map((sys, i) => (
              <div key={i} className="p-10 border ghost-border rounded-xl bg-surface hover:shadow-lg transition-shadow">
                <Database className="w-8 h-8 text-primary mb-6 stroke-[1.5]" />
                <h3 className="text-2xl font-bold text-primary mb-4">{sys.name}</h3>
                <p className="text-muted-foreground leading-relaxed">{sys.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 bg-surface">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <div className="mb-20">
            <p className="text-xs font-bold text-on-primary-container tracking-[0.2em] uppercase mb-4">Signature Method</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-primary max-w-3xl">Why Implementations Fail <br/>(And How We Execute)</h2>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
              70% of ERP projects fail because agencies treat them as software installations. We treat them as structural re-engineering.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-16">
             <div className="space-y-12">
               {[
                  { step: "1", title: "Audit & Blueprinting", desc: "We map physical operations to database schemas before writing a single line of configuration." },
                  { step: "2", title: "Decoupled Configuration", desc: "We customize the environment to match the blueprint, building custom modules only where native logic fails." },
                  { step: "3", title: "Data ETL & Validation", desc: "Rigorous extraction, transformation, and loading of legacy data with multiple reconciliation checks." },
                  { step: "4", title: "Phased Deployment", desc: "We launch modules in sequence (e.g., Accounting, then Inventory) to minimize operational disruption." }
               ].map((phase, i) => (
                  <div key={i} className="flex gap-8">
                     <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">{phase.step}</div>
                     <div>
                        <h3 className="text-2xl font-bold text-primary mb-3">{phase.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{phase.desc}</p>
                     </div>
                  </div>
               ))}
             </div>
             
             <div className="bg-primary p-12 rounded-xl text-white flex flex-col justify-center h-full">
                <h3 className="text-3xl font-bold mb-8">Ready to unify your architecture?</h3>
                <Link href="/contact" className="group flex items-center text-on-primary-container font-bold text-lg hover:text-white transition-colors">
                  Initiate Review <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-2" />
                </Link>
             </div>
          </div>
        </div>
      </section>
    </>
  );
}
