import { Seo } from "@/components/seo";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Database, Zap, Code, Network, ArrowRight } from "lucide-react";
import DataStream from "@/components/canvas/DataStream";
import { HeroCanvasFrame } from "@/components/motion/hero-canvas-frame";
import { CtaSection } from "@/components/motion/cta-section";
import { heroCopy, heroVisual, mountReveal } from "@/lib/motion-presets";

export default function Services() {
  const services = [
    { icon: Database, title: "ERP Architecture", desc: "End-to-end deployment of ERPNext, Odoo, and Zoho. We audit your operations, structure the database schema, migrate data, and launch.", href: "/services/erp" },
    { icon: Zap, title: "Middleware Automation", desc: "Eradicate manual data entry. We engineer resilient workflows that connect your disparate tools into a unified, autonomous engine.", href: "/services/automation" },
    { icon: Code, title: "Custom Engineering", desc: "When native integrations fall short, we develop bespoke software microservices perfectly tailored to your proprietary logic.", href: "/contact" },
    { icon: Network, title: "System Integration", desc: "Robust API bridges connecting legacy on-premise infrastructure with modern cloud applications and partner EDI networks.", href: "/contact" },
  ];

  return (
    <>
      <Seo
        title="Core Competencies | Precisefect"
        description="ERP implementation, middleware automation, and custom engineering for scaling enterprises."
        slug="/services"
      />

      {/* Hero with animated data stream canvas */}
      <section className="py-24 md:py-32 bg-surface relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
            <motion.div {...heroCopy} className="max-w-3xl">
              <p className="text-xs font-bold text-on-primary-container tracking-[0.2em] uppercase mb-4">Core Competencies</p>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-primary mb-8 leading-[0.95]">
                Architectural <br /><span className="text-on-primary-container">Capabilities.</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-10">
                We design digital infrastructure that enables massive operational throughput without the burden of linear headcount expansion.
              </p>
              <Link href="/contact">
                <button className="signature-gradient text-white font-bold rounded-lg px-10 py-5 btn-press text-lg">
                  Request Architectural Review
                </button>
              </Link>
            </motion.div>

            {/* Animated Data Stream Canvas */}
            <motion.div {...heroVisual} className="relative w-full aspect-video lg:aspect-[4/3] max-w-[600px] ml-auto min-h-[260px]">
              <HeroCanvasFrame>
                <DataStream intensity="normal" />              </HeroCanvasFrame>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, i) => (
              <motion.div
                key={i}
                {...mountReveal(0.15 + i * 0.08)}
                className="bg-surface-container-lowest ghost-border p-10 rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col group"
              >
                <service.icon className="w-10 h-10 text-primary mb-8 stroke-[1.5]" />
                <h3 className="text-2xl font-bold text-primary mb-4">{service.title}</h3>
                <p className="text-muted-foreground mb-12 flex-grow leading-relaxed">{service.desc}</p>
                <Link href={service.href} className="flex items-center text-sm font-bold text-primary group-hover:text-primary-container transition-colors mt-auto">
                  Examine Detail <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-2" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CtaSection
        title="Uncertain of the optimal protocol?"
        description="Submit a request for an architectural review. We will map your current bottlenecks and propose a unified data model."
      >
        <Link href="/contact">
          <button className="bg-white text-primary font-bold rounded-lg px-12 py-5 shadow-md btn-press text-lg">
            Request Architectural Review
          </button>
        </Link>
      </CtaSection>
    </>
  );
}
