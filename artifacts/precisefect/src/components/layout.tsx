import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logoUrl from "@/assets/logo.png";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Industries", href: "/industries" },
    { label: "Case Studies", href: "/case-studies" },
    { label: "Pricing", href: "/pricing" },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 border-b border-transparent ${
        isScrolled ? "bg-background/80 backdrop-blur-[24px] border-border shadow-sm py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-8 lg:px-16 flex items-center justify-between">
        <Link href="/" className="flex items-center" aria-label="Precisefect — Precision Meets Perfection">
          <img
            src={logoUrl}
            alt="Precisefect"
            className="h-35 md:h-24 w-auto -my-6"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = location === link.href || (link.href !== '/' && location.startsWith(link.href));
            return (
              <Link 
                key={link.href} 
                href={link.href} 
                className={`text-sm transition-colors py-1 ${
                  isActive 
                    ? "font-bold text-primary border-b-2 border-primary-container" 
                    : "font-medium text-muted-foreground hover:text-primary-container"
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-primary">
            Login
          </Link>
          <Link href="/contact">
            <button className="signature-gradient text-white font-bold rounded-lg px-8 py-3 shadow-sm btn-press">
              Consultation
            </button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-background border-b border-border shadow-lg py-6 md:hidden flex flex-col px-8 gap-4"
          >
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-base font-bold py-2 text-foreground/80 hover:text-primary border-b border-border/50">
                {link.label}
              </Link>
            ))}
            <Link href="/login" className="text-base font-bold py-2 text-foreground/80">
              Login
            </Link>
            <Link href="/contact" className="pt-4">
              <button className="w-full signature-gradient text-white font-bold rounded-lg px-8 py-3 btn-press">
                Consultation
              </button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-primary text-white py-24">
      <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="inline-block mb-6" aria-label="Precisefect">
              <img
                src={logoUrl}
                alt="Precisefect"
                className="h-20 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-white/70 mb-6 max-w-sm text-sm leading-relaxed">
              Architecting operational perfection. We build resilient, automated systems for enterprises that require scale without structural entropy.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold tracking-widest text-xs uppercase text-on-primary-container mb-6">Services</h3>
            <ul className="space-y-4">
              <li><Link href="/services/erp" className="text-sm text-white/70 hover:text-white transition-colors">ERP Architecture</Link></li>
              <li><Link href="/services/automation" className="text-sm text-white/70 hover:text-white transition-colors">Operational Automation</Link></li>
              <li><Link href="/services" className="text-sm text-white/70 hover:text-white transition-colors">Custom Integration</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold tracking-widest text-xs uppercase text-on-primary-container mb-6">Company</h3>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-sm text-white/70 hover:text-white transition-colors">About Firm</Link></li>
              <li><Link href="/case-studies" className="text-sm text-white/70 hover:text-white transition-colors">The Proof</Link></li>
              <li><Link href="/careers" className="text-sm text-white/70 hover:text-white transition-colors">Careers</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold tracking-widest text-xs uppercase text-on-primary-container mb-6">Contact</h3>
            <ul className="space-y-4">
              <li className="text-sm text-white/70">hello@precisefect.com</li>
              <li className="text-sm text-white/70">San Francisco · Bangalore</li>
              <li className="pt-4">
                <Link href="/contact">
                  <span className="text-sm font-bold text-white hover:text-on-primary-container transition-colors">Submit RFP &rarr;</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/50">
          <p>&copy; {new Date().getFullYear()} Precisefect Consulting. Proprietary & Confidential.</p>
          <div className="flex gap-8">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
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
    </div>
  );
}
