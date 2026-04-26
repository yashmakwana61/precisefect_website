import { Seo } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, BarChart, TrendingUp, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function CaseStudies() {
  const studies = [
    {
      client: "Nexus Manufacturing",
      industry: "Industrial Equipment",
      title: "Eliminating 40 Hours of Weekly Data Entry with ERPNext",
      metrics: [
        { label: "Inventory Accuracy", value: "99.8%", icon: TrendingUp },
        { label: "Order Processing Time", value: "-47%", icon: Clock },
        { label: "Annual Savings", value: "$180k", icon: BarChart }
      ],
      problem: "Nexus was operating on a legacy AS400 system heavily augmented by disjointed Excel sheets. Production scheduling was a guessing game, and purchasing managers spent 40+ hours a week manually reconciling inventory levels before placing orders. This led to frequent stockouts of critical components and bloated stockpiles of obsolete parts.",
      solution: "We completely deprecated the AS400 system and implemented a tailored ERPNext environment. We mapped their complex multi-level Bill of Materials (BOM) into the system and set up automated reorder points tied directly to the production schedule.",
      results: "The purchasing team now manages exceptions rather than manual counts. Order processing time dropped by 47%, and the elimination of safety stock overages resulted in an immediate working capital release of over $180,000 annually."
    },
    {
      client: "Aura Logistics",
      industry: "3PL & Freight",
      title: "Zero-Touch Invoicing Pipeline via Custom Automation",
      metrics: [
        { label: "Invoice Errors", value: "-92%", icon: TrendingUp },
        { label: "Days to Bill", value: "1 Day", icon: Clock },
        { label: "FTE Reallocated", value: "3 Staff", icon: BarChart }
      ],
      problem: "Aura's dispatchers were manually downloading proof of delivery (POD) PDFs, matching them to load numbers, and emailing the accounting team to generate invoices in QuickBooks. The average time from delivery to invoice was 8 days, causing severe cash flow drag and frequent billing errors due to manual data entry.",
      solution: "We engineered a middleware automation using Node.js and Make. When a driver uploads a POD via their mobile app, our system parses the document, matches the load ID, triggers an API call to QuickBooks to generate the invoice, attaches the POD, and emails it directly to the customer.",
      results: "Invoicing now happens within 24 hours of delivery with zero human intervention. Invoice error rates dropped by 92%, and three full-time accounting clerks were reallocated to higher-value financial analysis."
    },
    {
      client: "Veridian Retail",
      industry: "Omnichannel Retail",
      title: "Unifying 5 Sales Channels into One Operational Core",
      metrics: [
        { label: "Overselling Rate", value: "0%", icon: TrendingUp },
        { label: "Fulfillment Speed", value: "+3x", icon: Clock },
        { label: "Revenue Growth", value: "45%", icon: BarChart }
      ],
      problem: "Selling across Shopify, Amazon, wholesale B2B, and two physical storefronts, Veridian suffered from catastrophic inventory desyncs. Selling an item in-store wouldn't update Amazon fast enough, leading to oversold items, cancelled orders, and tanking marketplace seller metrics.",
      solution: "We implemented Odoo as the central nervous system. We built high-frequency API connectors to Shopify and Amazon, ensuring inventory decrements globally within seconds of a sale anywhere. We also digitized the warehouse picking process with barcode scanning directly into Odoo.",
      results: "Veridian completely eliminated overselling. The warehouse processes orders 3x faster, allowing the company to scale revenue by 45% over the next year without adding a single warehouse employee."
    }
  ];

  return (
    <>
      <Seo 
        title="Case Studies & Results | Precisefect" 
        description="Read how we helped manufacturing, logistics, and retail companies scale operations and save millions through ERP and automation."
      />
      
      <section className="py-24 bg-primary text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">The Engineering <br />Behind the Outcomes.</h1>
            <p className="text-xl text-primary-foreground/80 mb-8">
              We don't measure success by lines of code written or hours billed. We measure it by the operational capacity we unlock for our clients.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6 space-y-32">
          {studies.map((study, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              key={i} 
              className="flex flex-col gap-12"
            >
              <div className="border-b border-border pb-8">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-sm font-bold text-secondary uppercase tracking-wider">{study.client}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-border" />
                  <span className="text-sm text-muted-foreground">{study.industry}</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-primary">{study.title}</h2>
              </div>

              <div className="grid md:grid-cols-12 gap-12">
                <div className="md:col-span-4 space-y-6">
                  <div className="bg-muted/50 p-6 rounded-2xl border border-border">
                    <h3 className="font-bold text-primary mb-6 uppercase tracking-wider text-xs">The Metrics</h3>
                    <div className="space-y-6">
                      {study.metrics.map((metric, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-white dark:bg-black rounded-lg border border-border flex items-center justify-center text-primary">
                            <metric.icon size={20} />
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-primary">{metric.value}</div>
                            <div className="text-sm text-muted-foreground">{metric.label}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="md:col-span-8 space-y-8">
                  <div>
                    <h3 className="text-xl font-bold text-primary mb-3">The Problem</h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">{study.problem}</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-primary mb-3">The Solution</h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">{study.solution}</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-primary mb-3">The Result</h3>
                    <p className="text-lg text-foreground font-medium leading-relaxed border-l-4 border-accent pl-4 py-1">{study.results}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-24 bg-muted/30 text-center border-t border-border">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-primary mb-6">Your business could be next.</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Stop letting broken processes dictate your growth ceiling. Let's build a system that scales.
          </p>
          <Link href="/contact">
            <Button size="lg" className="bg-primary text-white rounded-full px-8">
              Book a Consultation
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
