import { Seo } from "@/components/seo";
import { Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { cmsApi, type BlogPost } from "@/lib/cms-api";

export default function Blog() {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["public", "blog-posts"],
    queryFn: () => cmsApi.list<BlogPost>("blog-posts"),
  });

  return (
    <>
      <Seo
        title="Field Notes & Insights | Precisefect"
        description="Technical and strategic insights on ERP implementation, business automation, and scaling operations."
      />

      <section className="py-24 md:py-32 bg-surface">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mb-24"
          >
            <p className="text-xs font-bold text-on-primary-container tracking-[0.2em] uppercase mb-4">Field Notes</p>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-primary mb-8 leading-[0.95]">
              Architectural <br />
              <span className="text-on-primary-container">Insights.</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Technical essays, architectural tear-downs, and operational strategy from the engineers at Precisefect.
            </p>
          </motion.div>

          {isLoading ? (
            <div className="text-muted-foreground">Loading…</div>
          ) : posts.length === 0 ? (
            <div className="bg-surface-container-lowest ghost-border rounded-xl p-16 text-center">
              <p className="text-lg text-muted-foreground">No field notes published yet.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, i) => (
                <motion.article
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  key={post.id}
                  data-testid={`card-blog-post-${post.id}`}
                  className="flex flex-col bg-surface-container-lowest ghost-border rounded-xl p-10 hover:-translate-y-1 hover:shadow-xl transition-all group cursor-pointer"
                >
                  <div className="mb-8">
                    <span className="text-xs font-bold text-primary uppercase tracking-[0.2em] border-b-2 border-primary-container pb-1">
                      {post.category}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-primary mb-4 group-hover:text-primary-container transition-colors tracking-tight">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground mb-12 flex-grow leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="pt-6 border-t border-border mt-auto flex items-center justify-between text-xs text-muted-foreground font-medium">
                    <div className="flex items-center gap-4">
                      <span className="text-primary">{post.author}</span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />{" "}
                        {new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}
                      </span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-32 bg-primary text-center">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16 max-w-2xl">
          <p className="text-xs font-bold text-on-primary-container tracking-[0.2em] uppercase mb-4">Transmission</p>
          <h2 className="text-4xl font-bold tracking-tight text-white mb-6">Receive Architectural Insights.</h2>
          <p className="text-white/70 mb-12 text-lg leading-relaxed">
            No marketing noise. Just high-signal essays on business systems engineering, dispatched monthly.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 justify-center" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Corporate Email Address"
              className="px-6 py-4 rounded-lg bg-surface-container-lowest border-none text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-container min-w-[320px] font-medium"
            />
            <button className="signature-gradient text-white font-bold rounded-lg px-8 py-4 btn-press">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
