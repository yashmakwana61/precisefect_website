import { Seo } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Target, Eye, ShieldCheck, Users } from "lucide-react";

export default function About() {
  return (
    <>
      <Seo 
        title="About Us" 
        description="Learn about Precisefect's mission to engineer perfect operational systems for growing businesses."
      />
      
      <section className="py-20 md:py-32 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="container relative mx-auto px-4 md:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">We engineer scale.</h1>
            <p className="text-xl text-primary-foreground/70 leading-relaxed">
              Precisefect was born from a simple observation: great businesses are often bottlenecked by terrible systems. We exist to remove those bottlenecks through precision engineering and perfect execution.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-6">Our Mission & Vision</h2>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center shrink-0">
                    <Target className="text-secondary w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">The Mission</h3>
                    <p className="text-muted-foreground">To eliminate manual chaos from growing organizations, enabling them to scale operations without linearly scaling headcount.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center shrink-0">
                    <Eye className="text-secondary w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">The Vision</h3>
                    <p className="text-muted-foreground">A future where business leaders focus entirely on strategy and growth, while flawless automated systems handle execution and compliance.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-card border border-border p-8 rounded-3xl">
              <h3 className="text-2xl font-bold mb-6">Why Choose Us</h3>
              <ul className="space-y-4">
                {[
                  { icon: ShieldCheck, title: "Engineering-First Approach", desc: "We are software engineers and architects, not just software resellers." },
                  { icon: Users, title: "Operations Expertise", desc: "We understand supply chain, finance, and manufacturing deeply." },
                  { icon: ArrowRight, title: "Obsessive Execution", desc: "We scope accurately, deliver on time, and don't disappear after launch." }
                ].map((item, i) => (
                  <li key={i} className="flex gap-4">
                    <item.icon className="w-6 h-6 text-accent shrink-0" />
                    <div>
                      <h4 className="font-semibold">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-primary mb-4">Leadership</h2>
            <p className="text-lg text-muted-foreground">Built by engineers who understand business.</p>
          </div>
          
          <div className="max-w-md mx-auto bg-card border border-border rounded-3xl p-8 text-center shadow-sm">
            <div className="w-32 h-32 bg-secondary/20 rounded-full mx-auto mb-6 flex items-center justify-center">
              <span className="text-4xl font-bold text-secondary">AM</span>
            </div>
            <h3 className="text-2xl font-bold text-primary mb-2">Alex Mercer</h3>
            <p className="text-accent font-medium mb-4">Founder & Principal Architect</p>
            <p className="text-muted-foreground">
              Former CTO of a mid-market logistics firm, Alex founded Precisefect after realizing most consulting agencies couldn't deliver the technical depth required to truly automate complex operations.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-primary text-center">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">Ready to upgrade your systems?</h2>
          <Link href="/contact">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground h-14 px-8 rounded-full">
              Schedule a Consultation
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
