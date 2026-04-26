import { Seo } from "@/components/seo";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Database, Zap, Code, Network, ArrowRight } from "lucide-react";

export default function Services() {
  const services = [
    {
      icon: Database,
      title: "ERP Architecture",
      desc: "End-to-end deployment of ERPNext, Odoo, and Zoho. We audit your operations, structure the database schema, migrate data, and launch.",
      href: "/services/erp",
    },
    {
      icon: Zap,
      title: "Middleware Automation",
      desc: "Eradicate manual data entry. We engineer resilient workflows that connect your disparate tools into a unified, autonomous engine.",
      href: "/services/automation",
    },
    {
      icon: Code,
      title: "Custom Engineering",
      desc: "When native integrations fall short, we develop bespoke software microservices perfectly tailored to your proprietary logic.",
      href: "/contact",
    },
    {
      icon: Network,
      title: "System Integration",
      desc: "Robust API bridges connecting legacy on-premise infrastructure with modern cloud applications and partner EDI networks.",
      href: "/contact",
    }
  ];

  return (
    <>
      <Seo 
        title="Core Competencies | Precisefect" 
        description="ERP implementation, middleware automation, and custom engineering for scaling enterprises."
      />
      
      <section className="py-24 md:py-32 bg-surface">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mb-24"
          >
            <p className="text-xs font-bold text-on-primary-container tracking-[0.2em] uppercase mb-4">Core Competencies</p>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-primary mb-8 leading-[0.95]">
              Architectural <br/>Capabilities.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We design digital infrastructure that enables massive operational throughput without the burden of linear headcount expansion.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={i}
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

      <section className="py-32 bg-primary text-white text-center">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16 max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">Uncertain of the optimal protocol?</h2>
          <p className="text-lg text-white/70 mb-12">
            Submit a request for an architectural review. We will map your current bottlenecks and propose a unified data model.
          </p>
          <Link href="/contact">
            <button className="bg-white text-primary font-bold rounded-lg px-12 py-5 shadow-md btn-press text-lg">
              Request Architectural Review
            </button>
          </Link>
        </div>
      </section>
    </>
  );
}
