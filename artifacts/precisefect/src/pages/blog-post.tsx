import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { heroCopy } from "@/lib/motion-presets";
import { Calendar, ArrowLeft } from "lucide-react";
import { Seo } from "@/components/seo";
import { cmsApi, type BlogPost } from "@/lib/cms-api";
import { HtmlSafe } from "@/components/html-safe";
import { usePreviewMode } from "@/hooks/use-preview";

export default function BlogPostPage() {
  const params = useParams<{ slug: string }>();
  const preview = usePreviewMode();

  const { data: post, isLoading, isError } = useQuery({
    queryKey: ["blog-post", params.slug, preview],
    queryFn: () => cmsApi.getBlogPostBySlug(params.slug, preview ? "preview" : undefined),
  });

  if (isLoading) return <div className="min-h-[60vh] flex items-center justify-center text-muted-foreground">Loading…</div>;
  if (isError || !post) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-8">
        <h1 className="text-4xl font-bold text-primary mb-4">Post Not Found</h1>
        <Link href="/blog" className="text-primary font-bold underline">Back to blog</Link>
      </div>
    );
  }

  return (
    <>
      <Seo title={`${post.title} | Precisefect`} description={post.excerpt} slug={`/blog/${post.slug}`} />
      <section className="py-24 md:py-32 bg-surface">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16 max-w-4xl">
          <Link href="/blog" className="inline-flex items-center text-sm font-bold text-muted-foreground hover:text-primary mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" /> All posts
          </Link>
          <motion.article {...heroCopy}>
            <span className="text-xs font-bold text-primary uppercase tracking-[0.2em] border-b-2 border-primary-container pb-1">{post.category}</span>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-primary mt-8 mb-6">{post.title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-12">
              <span className="text-primary font-medium">{post.author}</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(post.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </span>
              <span>{post.readTime}</span>
            </div>
            <p className="text-xl text-muted-foreground leading-relaxed mb-12 border-l-4 border-on-primary-container pl-6">{post.excerpt}</p>
            <HtmlSafe html={post.body} />
          </motion.article>
        </div>
      </section>
    </>
  );
}
