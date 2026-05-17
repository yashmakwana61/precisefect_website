import { Link } from "wouter";
import { motion } from "framer-motion";
import { heroCopy } from "@/lib/motion-presets";
import { Seo } from "@/components/seo";

export default function NotFound() {
  return (
    <>
      <Seo 
        title="404 - Vector Not Found | Precisefect" 
        description="The requested operational vector does not exist in the current architecture."
      />
      <div className="min-h-[70vh] flex items-center justify-center bg-surface relative overflow-hidden">
        <div className="absolute -inset-4 bg-primary-container/10 rounded-full blur-[120px] -z-10" />
        <motion.div {...heroCopy} className="text-center max-w-xl px-8">
          <p className="text-xs font-bold text-on-primary-container tracking-[0.2em] uppercase mb-6">Error 404</p>
          <h1 className="text-6xl font-bold tracking-tight text-primary mb-6">
            Vector Not Found.
          </h1>
          <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
            The requested operational vector does not exist within the current systemic architecture. Return to the root node.
          </p>
          <Link href="/">
            <button className="signature-gradient text-white font-bold rounded-lg px-10 py-4 shadow-md btn-press text-lg inline-flex items-center">
              Initialize Root Node
            </button>
          </Link>
        </motion.div>
      </div>
    </>
  );
}
