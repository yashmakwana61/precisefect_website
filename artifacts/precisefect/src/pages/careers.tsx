import { Seo } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { MapPin, Briefcase } from "lucide-react";

export default function Careers() {
  const roles = [
    {
      title: "ERP Implementation Consultant",
      location: "Remote (US/Canada)",
      type: "Full-time",
      desc: "Lead end-to-end deployments of ERPNext and Odoo. You need deep understanding of accounting, supply chain, and manufacturing principles alongside technical configuration skills."
    },
    {
      title: "Business Automation Engineer",
      location: "San Francisco, CA or Remote",
      type: "Full-time",
      desc: "Architect and deploy middleware integrations using Node.js, Python, and enterprise platforms (Make/n8n). Strong API design and data transformation experience required."
    },
    {
      title: "Solutions Architect",
      location: "Bangalore, India",
      type: "Full-time",
      desc: "Translate complex business requirements into technical blueprints. You will lead discovery phases, design database schemas, and map enterprise workflows."
    },
    {
      title: "Customer Success Manager",
      location: "Remote (Global)",
      type: "Full-time",
      desc: "Manage the post-launch hypercare period. Ensure client adoption of new ERP systems through training, documentation, and continuous workflow optimization."
    }
  ];

  return (
    <>
      <Seo 
        title="Careers | Precisefect" 
        description="Join Precisefect. We are hiring engineers, architects, and consultants who want to solve complex operational problems for growing businesses."
      />
      
      <section className="py-24 bg-primary text-white overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Build the systems that run businesses.</h1>
            <p className="text-xl text-primary-foreground/80 mb-8 leading-relaxed">
              We are a team of pragmatic engineers and operators. We value clear thinking, precise execution, and people who care deeply about the craft of building resilient systems.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mb-16">
            <h2 className="text-3xl font-bold text-primary mb-6">Open Positions</h2>
            <p className="text-lg text-muted-foreground">
              We are highly selective, but we move fast. If you are exceptionally competent in your domain, we want to talk to you.
            </p>
          </div>

          <div className="space-y-6 max-w-4xl">
            {roles.map((role, i) => (
              <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-8 bg-card border border-border rounded-2xl hover:border-primary/30 transition-colors gap-6">
                <div>
                  <h3 className="text-2xl font-bold text-primary mb-3">{role.title}</h3>
                  <div className="flex flex-wrap gap-4 text-sm font-medium text-muted-foreground mb-4">
                    <span className="flex items-center gap-1.5"><MapPin size={16} /> {role.location}</span>
                    <span className="flex items-center gap-1.5"><Briefcase size={16} /> {role.type}</span>
                  </div>
                  <p className="text-muted-foreground text-sm max-w-2xl">{role.desc}</p>
                </div>
                <div className="shrink-0">
                  <Button variant="outline" className="w-full md:w-auto rounded-full border-primary text-primary hover:bg-primary hover:text-white">
                    Apply Now
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 p-10 bg-secondary/5 rounded-3xl border border-secondary/20 max-w-4xl">
            <h3 className="text-2xl font-bold text-primary mb-4">Don't see your role?</h3>
            <p className="text-muted-foreground mb-6">
              We are always looking for exceptional talent. If you believe you belong here, send us your resume and a brief note about what you can build.
            </p>
            <Button className="bg-secondary hover:bg-secondary/90 text-white rounded-full">
              Send an Open Application
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
