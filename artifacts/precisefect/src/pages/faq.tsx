import { Seo } from "@/components/seo";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Faq() {
  const faqs = [
    {
      q: "What makes Precisefect different from other agencies?",
      a: "We are software engineers first, consultants second. Many agencies are simply resellers of software who rely on basic configuration. We build robust, custom-engineered architectures that solve deep operational problems, ensuring your systems scale without accumulating technical debt."
    },
    {
      q: "Which ERP system is right for my business?",
      a: "There is no universally 'best' ERP—only the best fit for your specific operations. We generally recommend ERPNext for highly custom manufacturing, Odoo for retail/e-commerce needing modularity, and Zoho One for service businesses heavily reliant on CRM. We determine the exact fit during our Discovery phase."
    },
    {
      q: "How long does an ERP implementation take?",
      a: "Depending on complexity and data migration needs, a standard implementation takes between 3 to 6 months. We utilize phased rollouts (e.g., launching Finance first, then Inventory, then Production) to mitigate operational risk and deliver value faster."
    },
    {
      q: "Do you offer custom software development?",
      a: "Yes. When off-the-shelf software or standard ERP modules cannot accommodate a proprietary business process, we engineer custom applications (React, Node.js, Python) that integrate seamlessly into your core operational stack."
    },
    {
      q: "How do you handle data migration from legacy systems?",
      a: "Data migration is often the highest-risk phase. We build programmatic ETL (Extract, Transform, Load) scripts to pull data from your AS400, QuickBooks, or spreadsheets. We run multiple mock migrations and validations before the final production cutover."
    },
    {
      q: "What middleware do you use for automation?",
      a: "We are technology agnostic. For high-volume, enterprise-grade data, we build custom Node.js microservices. For standard workflows requiring agility, we utilize platforms like Make (Integromat), n8n, or Zapier, always implementing proper error handling."
    },
    {
      q: "We just need one specific workflow automated. Do you do small projects?",
      a: "Yes, we offer 'Automation Sprints' starting at $5k specifically designed to solve targeted bottlenecks (e.g., automating the Quote-to-Cash process) without requiring a full system overhaul."
    },
    {
      q: "Will we own the software and data?",
      a: "Absolutely. You pay the software licensing fees directly to the vendor (Odoo, Zoho, etc.) or host open-source platforms (ERPNext) on your own AWS/GCP infrastructure. We build the house; you own the deed."
    }
  ];

  return (
    <>
      <Seo 
        title="Frequently Asked Questions | Precisefect" 
        description="Answers to common questions about ERP implementation, business automation, timelines, and our consulting methodology."
      />
      
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">Frequently Asked Questions</h1>
            <p className="text-xl text-muted-foreground">
              Clarity is a prerequisite for engineering. Here's how we operate.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-b border-border py-2">
                <AccordionTrigger className="text-left text-lg font-bold text-primary hover:text-secondary hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed pt-2 pb-6">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-20 p-8 bg-muted/50 rounded-3xl border border-border text-center">
            <h3 className="text-2xl font-bold text-primary mb-4">Still have questions?</h3>
            <p className="text-muted-foreground mb-8">We're happy to discuss your specific technical constraints.</p>
            <Link href="/contact">
              <Button className="bg-primary text-white rounded-full px-8">
                Contact Our Team
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
