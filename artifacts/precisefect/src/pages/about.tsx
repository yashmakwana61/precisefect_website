import { Seo } from "@/components/seo";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Network, Database, ShieldCheck, ArrowRight } from "lucide-react";

export default function About() {
  return (
    <>
      <Seo 
        title="About Us | Precisefect" 
        description="Learn about Precisefect's mission to architect perfect operational systems for scaling enterprises."
      />
      
      <section className="py-24 md:py-32 bg-surface relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-xs font-bold text-on-primary-container tracking-[0.2em] uppercase mb-4">Firm Profile</p>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-primary mb-8 leading-[0.95]">
              We engineer <span className="text-on-primary-container">scale.</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mb-8">
              Precisefect was born from a simple observation: great businesses are often bottlenecked by terrible systems. We exist to remove those bottlenecks through precision engineering and perfect execution.
            </p>
            <Link href="/contact" className="group flex items-center text-primary font-bold text-lg hover:text-primary-container transition-colors">
              Submit RFP <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-2" />
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative w-full aspect-video lg:aspect-square max-w-[600px] ml-auto"
          >
            <div className="w-full h-full bg-surface-container-lowest ghost-border p-4 rounded-xl shadow-lg">
              <div className="w-full h-full bg-primary rounded-lg flex items-center justify-center overflow-hidden relative">
                <div className="absolute inset-0 opacity-20 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,1)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px]" />
                <Network className="w-32 h-32 text-surface opacity-50 stroke-[1]" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-32 bg-surface-container-lowest border-y border-border">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <div className="mb-20">
            <p className="text-xs font-bold text-on-primary-container tracking-[0.2em] uppercase mb-4">The Mandate</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-primary">Mission & Vision</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-16">
            <div className="flex gap-8">
               <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">1</div>
               <div>
                  <h3 className="text-2xl font-bold text-primary mb-4">The Mission</h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">To audit, decouple, and re-engineer manual chaos from growing organizations, enabling them to scale operations without linearly scaling headcount.</p>
               </div>
            </div>
            <div className="flex gap-8">
               <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">2</div>
               <div>
                  <h3 className="text-2xl font-bold text-primary mb-4">The Vision</h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">A paradigm where enterprise leaders focus entirely on strategy and growth, while flawless automated architectures handle execution and compliance.</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 bg-surface">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
           <div className="mb-20">
            <p className="text-xs font-bold text-on-primary-container tracking-[0.2em] uppercase mb-4">Operational Differentiators</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-primary">Why Firms Choose Us</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-16">
            {[
              { icon: ShieldCheck, title: "Engineering-First", desc: "We are software engineers and system architects, not glorified resellers. We write code when configuration fails." },
              { icon: Database, title: "Domain Mastery", desc: "Deep structural understanding of supply chain, finance, and industrial manufacturing workflows." },
              { icon: Network, title: "Obsessive Execution", desc: "We map dependencies accurately, deploy in safe phases, and never abandon a system post-launch." }
            ].map((item, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                key={i}
              >
                <item.icon className="w-10 h-10 text-primary mb-6 stroke-[1.5]" />
                <h3 className="text-xl font-bold text-primary mb-4">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
