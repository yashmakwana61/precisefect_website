import { Seo } from "@/components/seo";
import { Link } from "wouter";
import { Factory, ShoppingBag, Truck, TestTube, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Industries() {
  const industries = [
    {
      id: "manufacturing",
      icon: Factory,
      title: "Industrial Manufacturing",
      desc: "Stop running your shop floor on whiteboards and disconnected spreadsheets.",
      painPoints: ["Inaccurate BOM costing", "Disconnected inventory and production planning", "Poor traceability"],
      solution: "We implement robust MRP modules within ERPNext or Odoo, linking procurement directly to production schedules, ensuring accurate job costing and real-time inventory visibility."
    },
    {
      id: "retail",
      icon: ShoppingBag,
      title: "Omnichannel Retail",
      desc: "Unify your omnichannel sales data and prevent costly stockouts.",
      painPoints: ["Overselling due to delayed inventory sync", "Fragmented customer data", "Manual order fulfillment"],
      solution: "We build custom automation pipelines connecting Shopify/Magento to your ERP, enabling zero-touch order routing, automated PO generation, and unified CRM profiles."
    },
    {
      id: "logistics",
      icon: Truck,
      title: "Logistics & Supply Chain",
      desc: "Gain visibility into your entire supply chain with automated routing and tracking.",
      painPoints: ["Inefficient route planning", "Lost shipment documentation", "Delayed invoicing"],
      solution: "We integrate fleet management tools with your core financial systems. Automate proof-of-delivery logging, trigger invoices instantly, and optimize dispatch workflows."
    },
    {
      id: "pharma",
      icon: TestTube,
      title: "Pharmaceuticals & Healthcare",
      desc: "Ensure compliance while streamlining batch tracking and quality control.",
      painPoints: ["Rigorous compliance tracking overhead", "Batch recall nightmares", "Complex quality assurance workflows"],
      solution: "We deploy highly customized ERP environments tailored for FDA/GMP compliance. Automated batch traceability, strict QA approval workflows, and secure digital signatures."
    }
  ];

  return (
    <>
      <Seo 
        title="Sector Expertise | Precisefect" 
        description="Precisefect engineers operational systems for Manufacturing, Retail, Logistics, and Pharma businesses."
      />
      
      <section className="py-24 md:py-32 bg-surface relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-xs font-bold text-on-primary-container tracking-[0.2em] uppercase mb-4">Sector Expertise</p>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-primary mb-8 leading-[0.95]">
              Engineered for <br />
              <span className="text-on-primary-container">your vertical.</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-12 max-w-xl">
              We don't do generic implementations. We engineer architectures that address the specific operational physics and regulatory constraints of your industry.
            </p>
            <Link href="/contact" className="group flex items-center text-primary font-bold text-lg hover:text-primary-container transition-colors">
              Discuss Your Use Case <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-2" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative w-full aspect-video lg:aspect-square max-w-[600px] ml-auto"
          >
            <div className="absolute -inset-4 bg-primary-container/20 rounded-full blur-[120px] -z-10" />
            <div className="w-full h-full bg-surface-container-lowest ghost-border p-4 rounded-xl shadow-xl flex flex-wrap gap-4 items-center justify-center p-12">
               <div className="w-[45%] aspect-square bg-surface-container-high rounded-xl flex items-center justify-center">
                  <Factory className="w-12 h-12 text-primary opacity-50 stroke-[1.5]" />
               </div>
               <div className="w-[45%] aspect-square bg-surface-container-high rounded-xl flex items-center justify-center">
                  <ShoppingBag className="w-12 h-12 text-primary opacity-50 stroke-[1.5]" />
               </div>
               <div className="w-[45%] aspect-square bg-surface-container-high rounded-xl flex items-center justify-center">
                  <Truck className="w-12 h-12 text-primary opacity-50 stroke-[1.5]" />
               </div>
               <div className="w-[45%] aspect-square bg-surface-container-high rounded-xl flex items-center justify-center">
                  <TestTube className="w-12 h-12 text-primary opacity-50 stroke-[1.5]" />
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-32 bg-surface-container-lowest border-y border-border">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <div className="space-y-16">
            {industries.map((ind, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                key={ind.id} 
                className="grid lg:grid-cols-12 gap-12 bg-surface ghost-border rounded-xl p-10 lg:p-16 hover:shadow-lg transition-shadow"
              >
                <div className="lg:col-span-4">
                  <ind.icon className="w-12 h-12 text-primary mb-8 stroke-[1.5]" />
                  <h2 className="text-3xl font-bold text-primary mb-4">{ind.title}</h2>
                  <p className="text-lg text-muted-foreground">{ind.desc}</p>
                </div>
                
                <div className="lg:col-span-8 grid md:grid-cols-2 gap-12 lg:pl-12 lg:border-l border-border">
                  <div>
                    <p className="text-xs font-bold text-on-primary-container tracking-[0.2em] uppercase mb-6">The Symptoms</p>
                    <ul className="space-y-4">
                      {ind.painPoints.map((pt, idx) => (
                        <li key={idx} className="flex gap-3 text-muted-foreground font-medium">
                          <span className="text-destructive font-bold mt-0.5">✕</span> {pt}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-on-primary-container tracking-[0.2em] uppercase mb-6">The Engineering</p>
                    <p className="text-foreground leading-relaxed">
                      {ind.solution}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
