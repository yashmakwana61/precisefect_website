import { Seo } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Calendar, Clock, ArrowRight } from "lucide-react";

export default function Blog() {
  const posts = [
    {
      category: "ERP Strategy",
      title: "Why Odoo is Quietly Winning the Mid-Market ERP Battle",
      excerpt: "Analyzing the architectural choices that make Odoo a formidable competitor to NetSuite for growing manufacturing and retail brands.",
      readTime: "6 min read",
      date: "Oct 12, 2023",
      author: "Alex Mercer"
    },
    {
      category: "Automation",
      title: "Stop Using Zapier Like a Junior Developer",
      excerpt: "Common architectural mistakes in no-code middleware that lead to silent failures, and how to build resilient error-handling instead.",
      readTime: "8 min read",
      date: "Oct 05, 2023",
      author: "Sarah Chen"
    },
    {
      category: "Operations",
      title: "The True Cost of Manual Data Entry in Logistics",
      excerpt: "We broke down the hidden margin erosion caused by dispatchers manually typing BOLs. The numbers are staggering.",
      readTime: "5 min read",
      date: "Sep 28, 2023",
      author: "David Park"
    },
    {
      category: "ERP Strategy",
      title: "ERPNext vs Zoho One: Choosing Your Ecosystem",
      excerpt: "An unbiased technical comparison of open-source agility vs a highly integrated proprietary suite.",
      readTime: "10 min read",
      date: "Sep 15, 2023",
      author: "Alex Mercer"
    },
    {
      category: "Case Study Insights",
      title: "How We Automated 92% of an Accounting Department",
      excerpt: "A deep dive into the specific API endpoints and workflow logic used to eliminate manual invoicing for Aura Logistics.",
      readTime: "7 min read",
      date: "Sep 02, 2023",
      author: "Sarah Chen"
    },
    {
      category: "Automation",
      title: "Preparing Your Data for AI Process Optimization",
      excerpt: "Before you can deploy LLMs to classify your inbound emails and documents, your fundamental data architecture must be spotless.",
      readTime: "6 min read",
      date: "Aug 21, 2023",
      author: "David Park"
    }
  ];

  return (
    <>
      <Seo 
        title="Insights & Engineering Blog | Precisefect" 
        description="Technical and strategic insights on ERP implementation, business automation, and scaling operations."
      />
      
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">Insights.</h1>
            <p className="text-xl text-muted-foreground">
              Technical essays, architectural tear-downs, and operational strategy from the engineers at Precisefect.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, i) => (
              <article key={i} className="flex flex-col bg-card border border-border rounded-3xl p-8 hover:border-primary/30 transition-colors group cursor-pointer">
                <div className="mb-6">
                  <span className="text-xs font-bold text-secondary uppercase tracking-wider px-3 py-1 bg-secondary/10 rounded-full">
                    {post.category}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-primary mb-4 group-hover:text-secondary transition-colors">
                  {post.title}
                </h2>
                <p className="text-muted-foreground mb-8 flex-grow leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="pt-6 border-t border-border mt-auto flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span className="font-medium text-foreground">{post.author}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Button variant="outline" size="lg" className="rounded-full px-8 border-primary/20">
              Load More Articles
            </Button>
          </div>
        </div>
      </section>

      <section className="py-24 bg-primary text-center">
        <div className="container mx-auto px-4 md:px-6 max-w-2xl">
          <h2 className="text-3xl font-bold text-white mb-6">Get insights in your inbox.</h2>
          <p className="text-primary-foreground/70 mb-8">
            No spam. Just high-signal essays on business systems engineering, sent once a month.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 justify-center" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Email address" 
              className="px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-accent min-w-[300px]"
            />
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full h-[58px] px-8">
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </>
  );
}
