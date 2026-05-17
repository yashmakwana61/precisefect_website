import { Seo } from "@/components/seo";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Database, ShieldCheck, ArrowRight, Target } from "lucide-react";
import NodeGraph from "@/components/canvas/NodeGraph";
import { PageHero } from "@/components/motion/page-hero";
import { HeroCanvasFrame } from "@/components/motion/hero-canvas-frame";
import { SectionHeading } from "@/components/motion/section-heading";
import { sectionReveal, itemReveal } from "@/lib/motion-presets";
import { useSitePage } from "@/hooks/use-site-page";

export default function About() {
  const { content } = useSitePage("/about");

  return (
    <>
      <Seo
        title={content.metaTitle || "About Us | Precisefect"}
        description={content.metaDescription || "Learn about Precisefect's mission to architect perfect operational systems for scaling enterprises."}
      />

      <PageHero
        visualCentered
        visual={
          <HeroCanvasFrame>
            <NodeGraph variant="hub" className="opacity-95" />          </HeroCanvasFrame>
        }
      >
        <p className="text-xs font-bold text-on-primary-container tracking-[0.2em] uppercase mb-4">{content.heroEyebrow}</p>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-primary mb-8 leading-[0.95]">
          {content.heroHeadline}
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mb-8">
          {content.heroSubheadline}
        </p>
        <Link href="/contact" className="group flex items-center text-primary font-bold text-lg hover:text-primary-container transition-colors">
          Submit RFP <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-2" />
        </Link>
      </PageHero>

      <section className="py-32 bg-surface-container-lowest border-y border-border">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <SectionHeading eyebrow="The Mandate" title="Mission & Vision" />
          <motion.div className="grid md:grid-cols-2 gap-16" {...sectionReveal()}>
            <div className="flex gap-8">
              <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">1</div>
              <div>
                <h3 className="text-2xl font-bold text-primary mb-4">The Mission</h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  To audit, decouple, and re-engineer manual chaos from growing organizations, enabling them to scale operations without linearly scaling headcount.
                </p>
              </div>
            </div>
            <div className="flex gap-8">
              <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">2</div>
              <div>
                <h3 className="text-2xl font-bold text-primary mb-4">The Vision</h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  A paradigm where enterprise leaders focus entirely on strategy and growth, while flawless automated architectures handle execution and compliance.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-32 bg-surface">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <SectionHeading eyebrow="Operational Differentiators" title="Why Firms Choose Us" />
          <div className="grid md:grid-cols-3 gap-16">
            {[
              { icon: ShieldCheck, title: "Engineering-First", desc: "We are software engineers and system architects, not glorified resellers. We write code when configuration fails." },
              { icon: Database, title: "Domain Mastery", desc: "Deep structural understanding of supply chain, finance, and industrial manufacturing workflows." },
              { icon: Target, title: "Obsessive Execution", desc: "We map dependencies accurately, deploy in safe phases, and never abandon a system post-launch." },
            ].map((item, i) => (
              <motion.div key={item.title} {...itemReveal(i)}>
                <item.icon className="w-10 h-10 text-primary mb-6 stroke-[1.5]" />
                <h3 className="text-xl font-bold text-primary mb-4">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
