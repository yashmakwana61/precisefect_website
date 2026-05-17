import { Seo } from "@/components/seo";
import { MapPin, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import { heroCopy, heroVisualCentered, sectionReveal } from "@/lib/motion-presets";
import { useQuery } from "@tanstack/react-query";
import { cmsPublic } from "@/lib/cms-public";
import type { JobOpening } from "@/lib/cms-api";
import { HtmlSafe } from "@/components/html-safe";
import { usePreviewMode } from "@/hooks/use-preview";

export default function Careers() {
  const preview = usePreviewMode();
  const { data: roles = [], isLoading } = useQuery({
    queryKey: ["public", "job-openings", preview],
    queryFn: () => cmsPublic.list<JobOpening>("job-openings", preview ? "preview" : undefined),
  });

  return (
    <>
      <Seo
        title="Careers & Engineering Roles | Precisefect"
        description="Join Precisefect. We are hiring engineers, architects, and structural consultants who want to solve complex operational problems."
      />

      <section className="py-24 md:py-32 bg-surface relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div {...heroCopy}>
            <p className="text-xs font-bold text-on-primary-container tracking-[0.2em] uppercase mb-4">Open Positions</p>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-primary mb-8 leading-[0.95]">
              Architect <br />
              <span className="text-on-primary-container">the Core.</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-12 max-w-xl">
              We are a collective of pragmatic engineers and system operators. We value precision, structural thinking, and those obsessed with the craft of resilient architecture.
            </p>
          </motion.div>

          <motion.div {...heroVisualCentered} className="relative w-full aspect-video lg:aspect-square max-w-[600px] ml-auto">
            <div className="absolute -inset-4 bg-primary-container/20 rounded-full blur-[120px] -z-10" />
            <div className="w-full h-full bg-surface-container-lowest ghost-border p-4 rounded-xl shadow-xl flex flex-col items-center justify-center relative overflow-hidden group">
              <div className="w-full h-full bg-surface-container-high rounded-lg border border-border flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-700">
                <div className="flex flex-col gap-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex gap-3">
                      <div className={`w-8 h-8 rounded-sm ${i % 2 === 0 ? "bg-primary" : "bg-primary-container"} opacity-80`} />
                      <div className={`w-8 h-8 rounded-sm ${i % 3 === 0 ? "bg-on-primary-container" : "bg-primary"} opacity-70`} />
                      <div className={`w-8 h-8 rounded-sm ${i % 2 !== 0 ? "bg-primary-container" : "bg-primary"} opacity-60`} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-32 bg-surface-container-lowest border-y border-border">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <div className="mb-20">
            <p className="text-xs font-bold text-on-primary-container tracking-[0.2em] uppercase mb-4">Engineering Roster</p>
            <h2 className="text-4xl font-bold tracking-tight text-primary mb-6">Current Vacancies</h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              We operate with high selectivity but high velocity. If you possess exceptional structural competence, deploy an application below.
            </p>
          </div>

          {isLoading ? (
            <div className="text-muted-foreground">Loading…</div>
          ) : roles.length === 0 ? (
            <div className="bg-surface ghost-border rounded-xl p-12 text-center max-w-5xl">
              <p className="text-muted-foreground">No vacancies open at the moment. Check back soon.</p>
            </div>
          ) : (
            <motion.div className="space-y-6 max-w-5xl" {...sectionReveal()}>
              {roles.map((role) => (
                <div
                  key={role.id}
                  data-testid={`card-job-${role.id}`}
                  className="flex flex-col lg:flex-row lg:items-center justify-between p-10 bg-surface ghost-border rounded-xl hover:-translate-y-1 hover:shadow-xl transition-all gap-8 group"
                >
                  <div>
                    <h3 className="text-2xl font-bold text-primary mb-4 group-hover:text-primary-container transition-colors tracking-tight">{role.title}</h3>
                    <div className="flex flex-wrap gap-6 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-6">
                      <span className="flex items-center gap-2"><MapPin size={14} className="stroke-[2]" /> {role.location}</span>
                      <span className="flex items-center gap-2"><Briefcase size={14} className="stroke-[2]" /> {role.employmentType}</span>
                    </div>
                    <HtmlSafe html={role.description} className="text-base leading-relaxed max-w-2xl" />
                  </div>
                  <div className="shrink-0 mt-4 lg:mt-0">
                    <a
                      href={role.applyUrl || "/contact"}
                      target={role.applyUrl ? "_blank" : undefined}
                      rel={role.applyUrl ? "noreferrer" : undefined}
                      className="inline-block bg-surface-container-high text-primary font-bold rounded-lg px-8 py-4 hover:bg-primary-container hover:text-white transition-colors btn-press w-full lg:w-auto text-center"
                    >
                      Submit Credentials
                    </a>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          <motion.div className="mt-24 p-12 bg-primary rounded-xl text-white max-w-5xl" {...sectionReveal(0.08)}>
            <h3 className="text-3xl font-bold tracking-tight mb-4">Structural anomaly detected?</h3>
            <p className="text-white/70 mb-8 max-w-2xl leading-relaxed text-lg">
              If your expertise doesn't map to an active vacancy but you believe you belong in this architecture, transmit your credentials and a brief dossier on what you are capable of engineering.
            </p>
            <button className="bg-white text-primary font-bold rounded-lg px-10 py-4 btn-press text-lg">
              Transmit Open Application
            </button>
          </motion.div>
        </div>
      </section>
    </>
  );
}
