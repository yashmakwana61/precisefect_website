import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import logoUrl from "@/assets/logo.png";
import { WhatsAppWidget } from "@/components/whatsapp-widget";
import { cmsApi, type NavbarContent, type FooterContent } from "@/lib/cms-api";
import { usePreviewMode } from "@/hooks/use-preview";

const FALLBACK_NAV: NavbarContent = {
  links: [
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Industries", href: "/industries" },
    { label: "Case Studies", href: "/case-studies" },
    { label: "Pricing", href: "/pricing" },
  ],
  ctaLabel: "Consultation",
  ctaHref: "/contact",
};

const FALLBACK_FOOTER: FooterContent = {
  tagline: "Architecting operational perfection. We build resilient, automated systems for enterprises that require scale without structural entropy.",
  columns: [
    { title: "Services", links: [
      { label: "ERP Architecture", href: "/services/erp" },
      { label: "Operational Automation", href: "/services/automation" },
      { label: "Custom Integration", href: "/services" },
    ]},
    { title: "Company", links: [
      { label: "About Firm", href: "/about" },
      { label: "The Proof", href: "/case-studies" },
      { label: "Careers", href: "/careers" },
    ]},
    { title: "Contact", items: [
      { label: "hello@precisefect.com", href: "mailto:hello@precisefect.com" },
      { label: "San Francisco · Bangalore", href: "" },
      { label: "Submit RFP →", href: "/contact" },
    ]},
  ],
  legalLinks: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
  copyright: "Precisefect Consulting. Proprietary & Confidential.",
};

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const preview = usePreviewMode();

  const { data: blocks = [] } = useQuery({
    queryKey: ["site-blocks", "navbar", preview],
    queryFn: () => cmsApi.getSiteBlocks(["navbar"], preview ? "preview" : undefined),
  });

  const navContent = (blocks.find((b) => b.blockType === "navbar")?.content as unknown as NavbarContent) ?? FALLBACK_NAV;
  const navLinks = navContent.links ?? FALLBACK_NAV.links;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => setMobileMenuOpen(false), [location]);

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 border-b border-transparent ${isScrolled ? "bg-background/80 backdrop-blur-[24px] border-border shadow-sm py-4" : "bg-transparent py-6"}`}>
      <div className="max-w-[1440px] mx-auto px-8 lg:px-16 flex items-center justify-between">
        <Link href="/" className="flex items-center" aria-label="Precisefect — Precision Meets Perfection">
          <img src={logoUrl} alt="Precisefect" className="h-35 md:h-24 w-auto -my-6" />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = location === link.href || (link.href !== "/" && location.startsWith(link.href));
            return (
              <Link key={link.href} href={link.href} className={`text-sm transition-colors py-1 ${isActive ? "font-bold text-primary border-b-2 border-primary-container" : "font-medium text-muted-foreground hover:text-primary-container"}`}>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/admin" className="text-sm font-medium text-muted-foreground hover:text-primary">Login</Link>
          <Link href={navContent.ctaHref || "/contact"}>
            <button className="signature-gradient text-white font-bold rounded-lg px-8 py-3 shadow-sm btn-press">{navContent.ctaLabel || "Consultation"}</button>
          </Link>
        </div>

        <button className="md:hidden p-2 text-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-background border-b border-border shadow-lg py-6 md:hidden flex flex-col px-8 gap-4"
          >
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-base font-bold py-2 text-foreground/80 hover:text-primary border-b border-border/50">{link.label}</Link>
            ))}
            <Link href="/admin" className="text-base font-bold py-2 text-foreground/80">Admin</Link>
            <Link href={navContent.ctaHref || "/contact"} className="pt-4">
              <button className="w-full signature-gradient text-white font-bold rounded-lg px-8 py-3 btn-press">{navContent.ctaLabel || "Consultation"}</button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export function Footer() {
  const preview = usePreviewMode();
  const { data: blocks = [] } = useQuery({
    queryKey: ["site-blocks", "footer", preview],
    queryFn: () => cmsApi.getSiteBlocks(["footer"], preview ? "preview" : undefined),
  });
  const footer = (blocks.find((b) => b.blockType === "footer")?.content as unknown as FooterContent) ?? FALLBACK_FOOTER;

  return (
    <footer className="bg-primary text-white py-24">
      <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="inline-block mb-6" aria-label="Precisefect">
              <img src={logoUrl} alt="Precisefect" className="h-20 w-auto brightness-0 invert" />
            </Link>
            <p className="text-white/70 mb-6 max-w-sm text-sm leading-relaxed">{footer.tagline}</p>
          </div>
          {footer.columns?.map((col) => (
            <div key={col.title}>
              <h3 className="font-bold tracking-widest text-xs uppercase text-on-primary-container mb-6">{col.title}</h3>
              <ul className="space-y-4">
                {(col.links ?? col.items ?? []).map((item) => (
                  <li key={item.label}>
                    {item.href ? (
                      <Link href={item.href} className="text-sm text-white/70 hover:text-white transition-colors">{item.label}</Link>
                    ) : (
                      <span className="text-sm text-white/70">{item.label}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/50">
          <p>&copy; {new Date().getFullYear()} {footer.copyright}</p>
          <div className="flex gap-8">
            {footer.legalLinks?.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-white transition-colors">{l.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col flex-grow w-full bg-background font-sans text-foreground">
      <Navbar />
      <main className="flex-grow flex flex-col pt-[88px]">{children}</main>
      <Footer />
      <WhatsAppWidget />
    </div>
  );
}
