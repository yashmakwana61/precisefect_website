import { Seo } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, BarChart3, Clock, Database, Layers, ShieldCheck, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <>
      <Seo 
        title="ERP & Automation Consulting" 
        description="Precisefect implements ERP systems and builds business automation for scaling companies. Stop relying on spreadsheets and manual chaos."
      />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 md:pt-32 md:pb-48 overflow-hidden bg-background">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-50 pointer-events-none" />
        
        <div className="container relative mx-auto px-4 md:px-6 flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-secondary" />
            Transforming Operations for Growing Businesses
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-primary max-w-5xl mb-8 leading-[1.1]"
          >
            Scale your business, <br className="hidden md:block" />
            not your headcount.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-12"
          >
            We engineer perfect operational systems using cutting-edge ERP and automation. No more disconnected tools, no more manual data entry.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link href="/contact">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground h-14 px-8 text-lg rounded-full">
                Schedule a Discovery Call
              </Button>
            </Link>
            <Link href="/case-studies">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-primary/20 hover:bg-primary/5">
                View Our Results
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-12 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6">
          <p className="text-center text-primary-foreground/60 font-medium mb-8 text-sm tracking-widest uppercase">TRUSTED BY OPERATIONS LEADERS AT</p>
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-80">
            {/* Minimal text-based logos for serious B2B feel */}
            {["Nexus Manufacturing", "Aura Logistics", "Veridian Retail", "Quantis Pharma"].map((name) => (
              <div key={name} className="text-xl md:text-2xl font-bold tracking-tighter text-white">
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Prop */}
      <section className="py-24 md:py-32 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-primary mb-6">When the spreadsheets finally break, we build the system.</h2>
            <p className="text-lg text-muted-foreground">Growing pains shouldn't mean operational chaos. We replace manual workflows and fragmented data with centralized, automated architecture designed for serious scale.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Database, title: "Centralized Truth", desc: "One system for inventory, finance, and CRM. Stop reconciling data across five different platforms." },
              { icon: Zap, title: "Ruthless Automation", desc: "If a human is doing it more than twice, we automate it. Save thousands of hours in manual entry." },
              { icon: BarChart3, title: "Real-time Visibility", desc: "Make decisions based on what's happening right now, not what happened last month." }
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-2xl bg-card border border-border hover:border-primary/20 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-6 text-secondary">
                  <feature.icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Snapshot */}
      <section className="py-24 bg-muted/50 border-y border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">Our Expertise</h2>
              <p className="text-lg text-muted-foreground max-w-xl">Precision engineering for your core business operations.</p>
            </div>
            <Link href="/services">
              <Button variant="outline" className="rounded-full">
                View All Services <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Link href="/services/erp" className="group block">
              <div className="bg-card border border-border p-8 md:p-12 rounded-3xl h-full transition-all duration-300 hover:shadow-lg hover:border-primary/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-bl-[100px] -z-10 transition-transform group-hover:scale-110" />
                <Layers className="w-10 h-10 text-secondary mb-6" />
                <h3 className="text-2xl md:text-3xl font-bold text-primary mb-4">ERP Implementation</h3>
                <p className="text-muted-foreground mb-8 max-w-md">We architect and deploy robust ERP systems (ERPNext, Odoo, Zoho) tailored precisely to your operational model.</p>
                <div className="flex items-center text-sm font-semibold text-primary">
                  Explore ERP Solutions <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
            
            <Link href="/services/automation" className="group block">
              <div className="bg-primary border border-primary p-8 md:p-12 rounded-3xl h-full transition-all duration-300 hover:shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-[100px] -z-10 transition-transform group-hover:scale-110" />
                <Zap className="w-10 h-10 text-accent mb-6" />
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Business Automation</h3>
                <p className="text-white/70 mb-8 max-w-md">Custom integration layers and workflow automations that connect your tools and eliminate manual data handling entirely.</p>
                <div className="flex items-center text-sm font-semibold text-accent">
                  Explore Automation <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats / Proof */}
      <section className="py-24 md:py-32 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold text-primary mb-6">Proven outcomes. <br />No vanity metrics.</h2>
              <p className="text-lg text-muted-foreground mb-8">We measure our success by the hours saved and the operational capacity unlocked for our clients.</p>
              
              <div className="space-y-6">
                {[
                  { label: "Reduction in manual data entry", value: "85%" },
                  { label: "Faster order processing time", value: "3x" },
                  { label: "Average operational savings", value: "$12M+" }
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col border-b border-border pb-4">
                    <span className="text-4xl md:text-5xl font-bold text-secondary mb-2">{stat.value}</span>
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-card rounded-3xl p-8 border border-border shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <ShieldCheck className="text-primary w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-primary">"A completely different class of agency."</h4>
                  <p className="text-sm text-muted-foreground">Sarah Jenkins, COO at Nexus</p>
                </div>
              </div>
              <p className="text-lg text-foreground italic leading-relaxed">
                "Precisefect didn't just install software; they re-engineered how our entire supply chain team operates. We were drowning in disparate systems. Now, everything flows perfectly. They are the only partners we trust with our core infrastructure."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-white text-center">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to engineer your operations?</h2>
          <p className="text-xl text-white/70 mb-10">Stop treating the symptoms. Let's fix the underlying system.</p>
          <Link href="/contact">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground h-14 px-10 text-lg rounded-full">
              Book Your Free Discovery Call
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
