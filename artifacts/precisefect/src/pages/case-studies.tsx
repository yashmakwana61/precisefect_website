import { Seo } from "@/components/seo";
import { Link } from "wouter";
import { BarChart, TrendingUp, Clock, Zap, Shield, Users } from "lucide-react";
import { motion } from "framer-motion";
import { heroCopy, heroVisual, sectionReveal } from "@/lib/motion-presets";
import { useQuery } from "@tanstack/react-query";
import { cmsApi, type CaseStudy } from "@/lib/cms-api";
import { HtmlSafe } from "@/components/html-safe";
import { usePreviewMode } from "@/hooks/use-preview";
import MetricRise from "@/components/canvas/MetricRise";
import { HeroCanvasFrame } from "@/components/motion/hero-canvas-frame";

const ICON_MAP = { TrendingUp, Clock, BarChart, Zap, Shield, Users };

export default function CaseStudies() {
  const preview = usePreviewMode();
  const { data: studies = [], isLoading } = useQuery({
    queryKey: ["public", "case-studies", preview],
    queryFn: () => cmsApi.list<CaseStudy>("case-studies", preview ? "preview" : undefined),
  });

  return (
    <>
      <Seo
        title="Case Studies & Results | Precisefect"
        description="Read how we helped manufacturing, logistics, and retail companies scale operations and save millions through ERP and automation."
        slug="/case-studies"
      />

      {/* Hero with Metric Rise Canvas */}
      <section className="py-24 md:py-32 bg-surface relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div {...heroCopy}>
            <p className="text-xs font-bold text-on-primary-container tracking-[0.2em] uppercase mb-4">The Proof</p>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-primary mb-8 leading-[0.95]">
              Outcomes, <br /><span className="text-on-primary-container">Engineered.</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-12 max-w-xl">
              We don't measure success by lines of code written or hours billed. We measure it by the operational capacity we unlock for our clients. Examine the metrics.
            </p>
            <Link href="/contact">
              <button className="signature-gradient text-white font-bold rounded-lg px-10 py-5 shadow-md btn-press text-lg">
                Submit RFP
              </button>
            </Link>
          </motion.div>

          {/* Animated Metric Rise Canvas */}
          <motion.div {...heroVisual} className="relative w-full max-w-[600px] ml-auto min-h-[280px]">
            <HeroCanvasFrame>
              <MetricRise />
            </HeroCanvasFrame>
          </motion.div>
        </div>
      </section>

      {/* Case study detail sections */}
      <section className="py-32 bg-surface-container-lowest border-y border-border">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16 space-y-32">
          {isLoading ? (
            <div className="text-muted-foreground">Loading…</div>
          ) : studies.length === 0 ? (
            <div className="text-center text-muted-foreground py-16">No case studies published yet.</div>
          ) : (
            studies.map((study) => (
              <motion.div
                {...sectionReveal()}
                key={study.id}
                data-testid={`section-case-study-${study.id}`}
                className="flex flex-col gap-12"
              >
                <div className="border-b border-border pb-8">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-xs font-bold text-on-primary-container uppercase tracking-[0.2em]">{study.client}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-border" />
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">{study.industry}</span>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-primary max-w-4xl">{study.title}</h2>
                </div>

                <div className="grid lg:grid-cols-12 gap-16">
                  <div className="lg:col-span-4 space-y-6">
                    <div className="bg-surface ghost-border p-8 rounded-xl">
                      <p className="text-xs font-bold text-on-primary-container tracking-[0.2em] uppercase mb-8">The Metrics</p>
                      <div className="space-y-8">
                        {study.metrics.map((metric, idx) => {
                          const Icon = ICON_MAP[metric.icon] ?? TrendingUp;
                          return (
                            <div key={idx} className="flex items-center gap-6">
                              <div className="w-12 h-12 bg-surface-container-high rounded-lg flex items-center justify-center text-primary">
                                <Icon size={24} className="stroke-[1.5]" />
                              </div>
                              <div>
                                <div className="text-3xl font-bold text-primary tracking-tight">{metric.value}</div>
                                <div className="text-sm font-medium text-muted-foreground">{metric.label}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-8 space-y-12">
                    <div>
                      <h3 className="text-xl font-bold text-primary mb-4">The Entropy</h3>
                      <HtmlSafe html={study.problem} className="text-lg text-muted-foreground leading-relaxed" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-primary mb-4">The Architecture</h3>
                      <HtmlSafe html={study.solution} className="text-lg text-muted-foreground leading-relaxed" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-primary mb-4">The Result</h3>
                      <div className="text-lg font-medium text-foreground leading-relaxed border-l-4 border-on-primary-container pl-6 py-2">
                        <HtmlSafe html={study.results} />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>
    </>
  );
}
