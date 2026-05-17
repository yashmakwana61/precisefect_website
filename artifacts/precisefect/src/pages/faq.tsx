import { Seo } from "@/components/seo";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { FadeInView } from "@/components/motion/fade-in-view";
import NodeGraph from "@/components/canvas/NodeGraph";
import { HeroCanvasFrame } from "@/components/motion/hero-canvas-frame";
import { heroCopy, heroVisualCentered, sectionReveal } from "@/lib/motion-presets";
import { useQuery } from "@tanstack/react-query";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cmsApi, type Faq } from "@/lib/cms-api";
import { HtmlSafe } from "@/components/html-safe";
import { usePreviewMode } from "@/hooks/use-preview";

export default function FaqPage() {
  const preview = usePreviewMode();
  const { data: faqs = [], isLoading } = useQuery({
    queryKey: ["public", "faqs", preview],
    queryFn: () => cmsApi.list<Faq>("faqs", preview ? "preview" : undefined),
  });

  return (
    <>
      <Seo
        title="Operational Protocol FAQ | Precisefect"
        description="Answers to structural questions regarding ERP implementation, middleware automation, timelines, and our engineering methodology."
      />

      <section className="py-24 md:py-32 bg-surface relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
            <motion.div {...heroCopy}>
              <p className="text-xs font-bold text-on-primary-container tracking-[0.2em] uppercase mb-4">Common Questions</p>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-primary mb-8 leading-[0.95]">
                Operational <br />
                <span className="text-on-primary-container">Protocols.</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                Absolute clarity is a prerequisite for precision engineering. Examine our operational parameters.
              </p>
            </motion.div>
            <motion.div {...heroVisualCentered} className="relative w-full aspect-video lg:aspect-square max-w-[600px] ml-auto min-h-[280px]">
              <HeroCanvasFrame>
                <NodeGraph variant="hub" className="opacity-95" />              </HeroCanvasFrame>
            </motion.div>
          </div>

          <motion.div className="max-w-4xl mx-auto" {...sectionReveal(0.08)}>
            {isLoading ? (
              <div className="text-muted-foreground">Loading…</div>
            ) : faqs.length === 0 ? (
              <div className="text-center text-muted-foreground py-16">No FAQs published yet.</div>
            ) : (
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq) => (
                  <AccordionItem
                    key={faq.id}
                    value={`item-${faq.id}`}
                    data-testid={`accordion-faq-${faq.id}`}
                    className="border-b border-border py-4"
                  >
                    <AccordionTrigger className="text-left text-xl font-bold tracking-tight text-primary hover:text-primary-container hover:no-underline data-[state=open]:text-primary-container transition-colors">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-lg leading-relaxed pt-4 pb-8">
                      <HtmlSafe html={faq.answer} />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </motion.div>

          <FadeInView className="mt-24 p-12 bg-surface-container-lowest ghost-border rounded-xl text-center shadow-xl">
            <h3 className="text-3xl font-bold tracking-tight text-primary mb-4">Require further technical parameters?</h3>
            <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">Our architects are available to review your specific environmental constraints.</p>
            <Link href="/contact">
              <button className="signature-gradient text-white font-bold rounded-lg px-10 py-4 btn-press text-lg">
                Initiate Technical Dialogue
              </button>
            </Link>
          </FadeInView>
        </div>
      </section>
    </>
  );
}
