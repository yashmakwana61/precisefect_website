import { Seo } from "@/components/seo";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Faq() {
  const faqs = [
    {
      q: "What differentiates Precisefect's architecture from standard agencies?",
      a: "We are software engineers first, consultants second. The majority of agencies act merely as software resellers dependent on superficial configuration. We engineer robust, decoupled architectures that resolve deep operational anomalies, ensuring system scalability without technical debt accumulation."
    },
    {
      q: "Which ERP framework is optimal for our structural requirements?",
      a: "No singular ERP is universally optimal. We prescribe frameworks based on operational physics: ERPNext for highly custom industrial manufacturing, Odoo for retail necessitating modular ecosystems, and Zoho One for organizations governed by intense CRM workflows. Definitive architecture is mapped during the Audit phase."
    },
    {
      q: "What is the typical deployment timeline for an ERP environment?",
      a: "Subject to structural complexity and legacy data ETL requirements, a standard deployment spans 3 to 6 months. We execute phased rollouts (e.g., Finance core, followed by Inventory, then Production routing) to mitigate systemic risk and accelerate time-to-value."
    },
    {
      q: "Do you engineer custom software microservices?",
      a: "Affirmative. When standard vendor modules cannot adequately process proprietary business logic, we engineer decoupled microservices (React, Node.js, Python) that integrate natively into your central operational stack."
    },
    {
      q: "How is legacy data migration managed?",
      a: "Data ETL (Extract, Transform, Load) introduces the highest structural risk. We engineer programmatic pipelines to extract data from AS400, QuickBooks, or disparate spreadsheets. We execute multiple staging migrations and integrity validations prior to the production cutover."
    },
    {
      q: "Which middleware protocols do you utilize for automation?",
      a: "Our approach is framework-agnostic. For high-throughput, enterprise-scale data, we construct dedicated Node.js microservices. For standard operational workflows demanding rapid deployment, we leverage platforms like Make, n8n, or Zapier, stringently enforcing telemetry and error handling."
    },
    {
      q: "Can you automate isolated workflows without a full ERP deployment?",
      a: "Yes. We execute 'Automation Sprints' explicitly designed to decouple specific systemic bottlenecks (e.g., Quote-to-Cash routing) without mandating a comprehensive environmental overhaul."
    },
    {
      q: "Who retains sovereignty over the software and the data?",
      a: "You do. Software licensing fees are remitted directly to the vendor (Odoo, Zoho), or open-source platforms (ERPNext) are hosted on your proprietary AWS/GCP infrastructure. We engineer the architecture; you retain absolute ownership."
    }
  ];

  return (
    <>
      <Seo 
        title="Operational Protocol FAQ | Precisefect" 
        description="Answers to structural questions regarding ERP implementation, middleware automation, timelines, and our engineering methodology."
      />
      
      <section className="py-24 md:py-32 bg-surface">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16 max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-24"
          >
            <p className="text-xs font-bold text-on-primary-container tracking-[0.2em] uppercase mb-4">Common Questions</p>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-primary mb-8 leading-[0.95]">
              Operational <br />
              <span className="text-on-primary-container">Protocols.</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Absolute clarity is a prerequisite for precision engineering. Examine our operational parameters.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-b border-border py-4">
                  <AccordionTrigger className="text-left text-xl font-bold tracking-tight text-primary hover:text-primary-container hover:no-underline data-[state=open]:text-primary-container transition-colors">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-lg leading-relaxed pt-4 pb-8">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

          <div className="mt-24 p-12 bg-surface-container-lowest ghost-border rounded-xl text-center shadow-xl">
            <h3 className="text-3xl font-bold tracking-tight text-primary mb-4">Require further technical parameters?</h3>
            <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">Our architects are available to review your specific environmental constraints.</p>
            <Link href="/contact">
              <button className="signature-gradient text-white font-bold rounded-lg px-10 py-4 btn-press text-lg">
                Initiate Technical Dialogue
              </button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
