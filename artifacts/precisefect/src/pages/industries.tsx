import { Seo } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Factory, ShoppingBag, Truck, TestTube, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Industries() {
  const industries = [
    {
      id: "manufacturing",
      icon: Factory,
      title: "Manufacturing",
      desc: "Stop running your shop floor on whiteboards and disconnected spreadsheets.",
      painPoints: ["Inaccurate BOM costing", "Disconnected inventory and production planning", "Poor traceability"],
      solution: "We implement robust MRP modules within ERPNext or Odoo, linking procurement directly to production schedules, ensuring accurate job costing and real-time inventory visibility.",
      color: "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
    },
    {
      id: "retail",
      icon: ShoppingBag,
      title: "Retail & E-commerce",
      desc: "Unify your omnichannel sales data and prevent costly stockouts.",
      painPoints: ["Overselling due to delayed inventory sync", "Fragmented customer data", "Manual order fulfillment"],
      solution: "We build custom automation pipelines connecting Shopify/Magento to your ERP, enabling zero-touch order routing, automated PO generation, and unified CRM profiles.",
      color: "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
    },
    {
      id: "logistics",
      icon: Truck,
      title: "Logistics & Supply Chain",
      desc: "Gain visibility into your entire supply chain with automated routing and tracking.",
      painPoints: ["Inefficient route planning", "Lost shipment documentation", "Delayed invoicing"],
      solution: "We integrate fleet management tools with your core financial systems. Automate proof-of-delivery logging, trigger invoices instantly, and optimize dispatch workflows.",
      color: "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
    },
    {
      id: "pharma",
      icon: TestTube,
      title: "Pharmaceuticals & Healthcare",
      desc: "Ensure compliance while streamlining batch tracking and quality control.",
      painPoints: ["Rigorous compliance tracking overhead", "Batch recall nightmares", "Complex quality assurance workflows"],
      solution: "We deploy highly customized ERP environments tailored for FDA/GMP compliance. Automated batch traceability, strict QA approval workflows, and secure digital signatures.",
      color: "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400"
    }
  ];

  return (
    <>
      <Seo 
        title="Industries We Serve | ERP & Automation" 
        description="Precisefect engineers operational systems for Manufacturing, Retail, Logistics, and Pharma businesses."
      />
      
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mb-16 text-center mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">Built for your vertical.</h1>
            <p className="text-xl text-muted-foreground">
              We don't do generic implementations. We engineer solutions that address the specific operational physics of your industry.
            </p>
          </div>

          <div className="space-y-16">
            {industries.map((ind, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                key={ind.id} 
                className="grid md:grid-cols-12 gap-8 items-start bg-card border border-border rounded-3xl p-8 md:p-12"
              >
                <div className="md:col-span-4">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${ind.color}`}>
                    <ind.icon size={32} />
                  </div>
                  <h2 className="text-3xl font-bold text-primary mb-4">{ind.title}</h2>
                  <p className="text-lg text-muted-foreground">{ind.desc}</p>
                </div>
                
                <div className="md:col-span-8 grid md:grid-cols-2 gap-8 md:pl-8 md:border-l border-border">
                  <div>
                    <h3 className="font-bold text-primary mb-4 uppercase tracking-wider text-sm">The Symptoms</h3>
                    <ul className="space-y-3">
                      {ind.painPoints.map((pt, idx) => (
                        <li key={idx} className="flex gap-2 text-muted-foreground">
                          <span className="text-destructive mt-1 font-bold">✕</span> {pt}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-primary mb-4 uppercase tracking-wider text-sm">The Engineering</h3>
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

      <section className="py-24 bg-primary text-center">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-white mb-8">Don't see your industry?</h2>
          <p className="text-primary-foreground/70 mb-10 max-w-2xl mx-auto text-lg">
            If your business has complex operations, fragmented data, and a desire to scale, we can engineer a system for you.
          </p>
          <Link href="/contact">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-8">
              Discuss Your Custom Use Case
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
