import { Seo } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Layers, Zap, Code, Workflow, ArrowRight } from "lucide-react";

export default function Services() {
  const services = [
    {
      icon: Layers,
      title: "ERP Implementation",
      desc: "End-to-end deployment of ERPNext, Odoo, and Zoho. We map your operations, customize the system, migrate data, and train your team.",
      href: "/services/erp",
      color: "text-secondary"
    },
    {
      icon: Zap,
      title: "Business Automation",
      desc: "Remove human error from repeatable tasks. We build intelligent workflows that connect your disparate tools into a unified engine.",
      href: "/services/automation",
      color: "text-accent"
    },
    {
      icon: Code,
      title: "Custom Software",
      desc: "When off-the-shelf software falls short, we engineer bespoke applications perfectly tailored to your proprietary processes.",
      href: "/contact",
      color: "text-primary"
    },
    {
      icon: Workflow,
      title: "Integration Services",
      desc: "Seamless API integrations connecting your legacy on-premise systems with modern cloud infrastructure and partner portals.",
      href: "/contact",
      color: "text-secondary"
    }
  ];

  return (
    <>
      <Seo 
        title="Our Services | ERP & Automation" 
        description="Precisefect offers ERP implementation, business automation, custom software, and integration services for growing enterprises."
      />
      
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">Core Services</h1>
            <p className="text-xl text-muted-foreground">
              We architect digital infrastructure that enables operational scale without massive headcount expansion.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={i}
                className="bg-card border border-border p-8 md:p-10 rounded-3xl hover:border-primary/20 transition-all hover:shadow-md flex flex-col h-full"
              >
                <service.icon className={`w-12 h-12 mb-6 ${service.color}`} />
                <h3 className="text-2xl font-bold text-primary mb-4">{service.title}</h3>
                <p className="text-muted-foreground mb-8 flex-grow">{service.desc}</p>
                <Link href={service.href}>
                  <Button variant="outline" className="rounded-full w-fit">
                    Learn More <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-primary text-center">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">Not sure which solution fits?</h2>
          <p className="text-xl text-primary-foreground/70 mb-10 max-w-2xl mx-auto">
            Let's discuss your current bottlenecks. We'll outline a roadmap to streamline your operations.
          </p>
          <Link href="/contact">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground h-14 px-8 rounded-full">
              Book a Discovery Call
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
