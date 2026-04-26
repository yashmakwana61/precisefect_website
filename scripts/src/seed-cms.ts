import { db, blogPostsTable, caseStudiesTable, faqsTable, jobOpeningsTable, teamMembersTable, testimonialsTable } from "@workspace/db";

async function main() {
  console.log("Seeding CMS data...");

  // Blog posts
  await db.insert(blogPostsTable).values([
    {
      slug: "odoo-quietly-winning-mid-market-erp",
      title: "Why Odoo is Quietly Winning the Mid-Market ERP Battle",
      excerpt: "Analyzing the architectural choices that make Odoo a formidable competitor to NetSuite for growing manufacturing and retail brands.",
      body: "",
      category: "ERP Strategy",
      author: "Alex Mercer",
      readTime: "6 min read",
      publishedAt: new Date("2025-10-12"),
    },
    {
      slug: "stop-using-zapier-like-junior-developer",
      title: "Stop Using Zapier Like a Junior Developer",
      excerpt: "Common architectural mistakes in no-code middleware that lead to silent failures, and how to build resilient error-handling instead.",
      body: "",
      category: "Automation",
      author: "Sarah Chen",
      readTime: "8 min read",
      publishedAt: new Date("2025-10-05"),
    },
    {
      slug: "true-cost-manual-data-entry-logistics",
      title: "The True Cost of Manual Data Entry in Logistics",
      excerpt: "We broke down the hidden margin erosion caused by dispatchers manually typing BOLs. The numbers are staggering.",
      body: "",
      category: "Operations",
      author: "David Park",
      readTime: "5 min read",
      publishedAt: new Date("2025-09-28"),
    },
    {
      slug: "erpnext-vs-zoho-one",
      title: "ERPNext vs Zoho One: Choosing Your Ecosystem",
      excerpt: "An unbiased technical comparison of open-source agility vs a highly integrated proprietary suite.",
      body: "",
      category: "ERP Strategy",
      author: "Alex Mercer",
      readTime: "10 min read",
      publishedAt: new Date("2025-09-15"),
    },
    {
      slug: "automated-92-percent-accounting-department",
      title: "How We Automated 92% of an Accounting Department",
      excerpt: "A deep dive into the specific API endpoints and workflow logic used to eliminate manual invoicing for Aura Logistics.",
      body: "",
      category: "Case Study Insights",
      author: "Sarah Chen",
      readTime: "7 min read",
      publishedAt: new Date("2025-09-02"),
    },
    {
      slug: "preparing-data-for-ai-process-optimization",
      title: "Preparing Your Data for AI Process Optimization",
      excerpt: "Before you can deploy LLMs to classify your inbound emails and documents, your fundamental data architecture must be spotless.",
      body: "",
      category: "Automation",
      author: "David Park",
      readTime: "6 min read",
      publishedAt: new Date("2025-08-21"),
    },
  ]).onConflictDoNothing();

  // Case studies
  await db.insert(caseStudiesTable).values([
    {
      slug: "nexus-manufacturing-erp-architecture",
      client: "Nexus Manufacturing",
      industry: "Industrial Equipment",
      title: "Eliminating 40 Hours of Weekly Data Entry with ERP Architecture",
      problem: "Nexus was operating on a legacy AS400 system heavily augmented by disjointed Excel sheets. Production scheduling was a guessing game, and purchasing managers spent 40+ hours a week manually reconciling inventory levels before placing orders. This led to frequent stockouts of critical components and bloated stockpiles of obsolete parts.",
      solution: "We completely deprecated the AS400 system and implemented a tailored ERPNext environment. We mapped their complex multi-level Bill of Materials (BOM) into the system and set up automated reorder points tied directly to the production schedule.",
      results: "The purchasing team now manages exceptions rather than manual counts. Order processing time dropped by 47%, and the elimination of safety stock overages resulted in an immediate working capital release of over $180,000 annually.",
      metrics: [
        { label: "Inventory Accuracy", value: "99.8%", icon: "TrendingUp" },
        { label: "Order Processing Time", value: "-47%", icon: "Clock" },
        { label: "Annual Savings", value: "$180k", icon: "BarChart" },
      ],
    },
    {
      slug: "aura-logistics-zero-touch-invoicing",
      client: "Aura Logistics",
      industry: "3PL & Freight",
      title: "Zero-Touch Invoicing Pipeline via Custom Automation",
      problem: "Aura's dispatchers were manually downloading proof of delivery (POD) PDFs, matching them to load numbers, and emailing the accounting team to generate invoices in QuickBooks. The average time from delivery to invoice was 8 days, causing severe cash flow drag and frequent billing errors due to manual data entry.",
      solution: "We engineered a middleware automation using Node.js and Make. When a driver uploads a POD via their mobile app, our system parses the document, matches the load ID, triggers an API call to QuickBooks to generate the invoice, attaches the POD, and emails it directly to the customer.",
      results: "Invoicing now happens within 24 hours of delivery with zero human intervention. Invoice error rates dropped by 92%, and three full-time accounting clerks were reallocated to higher-value financial analysis.",
      metrics: [
        { label: "Invoice Errors", value: "-92%", icon: "TrendingUp" },
        { label: "Days to Bill", value: "1 Day", icon: "Clock" },
        { label: "FTE Reallocated", value: "3 Staff", icon: "BarChart" },
      ],
    },
    {
      slug: "veridian-retail-omnichannel-unification",
      client: "Veridian Retail",
      industry: "Omnichannel Retail",
      title: "Unifying 5 Sales Channels into One Operational Core",
      problem: "Selling across Shopify, Amazon, wholesale B2B, and two physical storefronts, Veridian suffered from catastrophic inventory desyncs. Selling an item in-store wouldn't update Amazon fast enough, leading to oversold items, cancelled orders, and tanking marketplace seller metrics.",
      solution: "We implemented Odoo as the central nervous system. We built high-frequency API connectors to Shopify and Amazon, ensuring inventory decrements globally within seconds of a sale anywhere. We also digitized the warehouse picking process with barcode scanning directly into Odoo.",
      results: "Veridian completely eliminated overselling. The warehouse processes orders 3x faster, allowing the company to scale revenue by 45% over the next year without adding a single warehouse employee.",
      metrics: [
        { label: "Overselling Rate", value: "0%", icon: "TrendingUp" },
        { label: "Fulfillment Speed", value: "+3x", icon: "Clock" },
        { label: "Revenue Growth", value: "45%", icon: "BarChart" },
      ],
    },
  ]).onConflictDoNothing();

  // FAQs
  await db.insert(faqsTable).values([
    { sortOrder: 10, question: "What differentiates Precisefect's architecture from standard agencies?", answer: "We are software engineers first, consultants second. The majority of agencies act merely as software resellers dependent on superficial configuration. We engineer robust, decoupled architectures that resolve deep operational anomalies, ensuring system scalability without technical debt accumulation." },
    { sortOrder: 20, question: "Which ERP framework is optimal for our structural requirements?", answer: "No singular ERP is universally optimal. We prescribe frameworks based on operational physics: ERPNext for highly custom industrial manufacturing, Odoo for retail necessitating modular ecosystems, and Zoho One for organizations governed by intense CRM workflows. Definitive architecture is mapped during the Audit phase." },
    { sortOrder: 30, question: "What is the typical deployment timeline for an ERP environment?", answer: "Subject to structural complexity and legacy data ETL requirements, a standard deployment spans 3 to 6 months. We execute phased rollouts (e.g., Finance core, followed by Inventory, then Production routing) to mitigate systemic risk and accelerate time-to-value." },
    { sortOrder: 40, question: "Do you engineer custom software microservices?", answer: "Affirmative. When standard vendor modules cannot adequately process proprietary business logic, we engineer decoupled microservices (React, Node.js, Python) that integrate natively into your central operational stack." },
    { sortOrder: 50, question: "How is legacy data migration managed?", answer: "Data ETL (Extract, Transform, Load) introduces the highest structural risk. We engineer programmatic pipelines to extract data from AS400, QuickBooks, or disparate spreadsheets. We execute multiple staging migrations and integrity validations prior to the production cutover." },
    { sortOrder: 60, question: "Which middleware protocols do you utilize for automation?", answer: "Our approach is framework-agnostic. For high-throughput, enterprise-scale data, we construct dedicated Node.js microservices. For standard operational workflows demanding rapid deployment, we leverage platforms like Make, n8n, or Zapier, stringently enforcing telemetry and error handling." },
    { sortOrder: 70, question: "Can you automate isolated workflows without a full ERP deployment?", answer: "Yes. We execute 'Automation Sprints' explicitly designed to decouple specific systemic bottlenecks (e.g., Quote-to-Cash routing) without mandating a comprehensive environmental overhaul." },
    { sortOrder: 80, question: "Who retains sovereignty over the software and the data?", answer: "You do. Software licensing fees are remitted directly to the vendor (Odoo, Zoho), or open-source platforms (ERPNext) are hosted on your proprietary AWS/GCP infrastructure. We engineer the architecture; you retain absolute ownership." },
  ]).onConflictDoNothing();

  // Job openings
  await db.insert(jobOpeningsTable).values([
    { sortOrder: 10, title: "ERP Implementation Architect", location: "Remote (US/Canada)", employmentType: "Full-time", description: "Lead end-to-end deployments of ERPNext and Odoo. Deep understanding of supply chain physics and database schema design required." },
    { sortOrder: 20, title: "Middleware Automation Engineer", location: "San Francisco, CA or Remote", employmentType: "Full-time", description: "Engineer resilient integrations using Node.js, Python, and enterprise middleware. Masterful API design and data ETL experience mandatory." },
    { sortOrder: 30, title: "Principal Solutions Architect", location: "Bangalore, India", employmentType: "Full-time", description: "Translate complex business entropy into structural blueprints. Design database schemas and map enterprise data flow before any code is written." },
    { sortOrder: 40, title: "Systems Success Manager", location: "Remote (Global)", employmentType: "Full-time", description: "Command the post-launch hypercare phase. Drive adoption of new ERP structures via rigorous training and continuous systemic optimization." },
  ]).onConflictDoNothing();

  // Team members
  await db.insert(teamMembersTable).values([
    { sortOrder: 10, name: "Alex Mercer", role: "Principal Architect & Founder", bio: "15 years architecting ERP and middleware systems for industrial and logistics enterprises.", imageUrl: "", linkedinUrl: "" },
    { sortOrder: 20, name: "Sarah Chen", role: "Director of Automation Engineering", bio: "Former staff engineer at a leading 3PL platform. Specialist in resilient middleware and zero-downtime ETL.", imageUrl: "", linkedinUrl: "" },
    { sortOrder: 30, name: "David Park", role: "Head of Operations Strategy", bio: "Brings a decade of supply chain consulting experience translating operational entropy into engineered systems.", imageUrl: "", linkedinUrl: "" },
  ]).onConflictDoNothing();

  // Testimonials
  await db.insert(testimonialsTable).values([
    { sortOrder: 10, quote: "Precisefect didn't sell us software — they engineered us out of a 40-hour-a-week reconciliation hole.", authorName: "James Holloway", authorRole: "VP of Operations", authorCompany: "Nexus Manufacturing" },
    { sortOrder: 20, quote: "Our invoicing went from 8-day cycles to under 24 hours. Cash flow improvement paid for the engagement in the first quarter.", authorName: "Marisa Tan", authorRole: "CFO", authorCompany: "Aura Logistics" },
    { sortOrder: 30, quote: "Five sales channels, zero overselling. The architectural rigor here is in another league.", authorName: "Daniel Reyes", authorRole: "COO", authorCompany: "Veridian Retail" },
  ]).onConflictDoNothing();

  console.log("Done.");
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
