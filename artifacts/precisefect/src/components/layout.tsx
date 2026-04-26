import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
        isScrolled ? "bg-background/90 backdrop-blur-md border-border shadow-sm py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-primary">
            Precise<span className="text-secondary">fect</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
              {link.label}
            </Link>
          ))}
          <Link href="/contact">
            <Button variant="default" className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-6">
              Book a Consultation
            </Button>
          </Link>
        </nav>

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
            className="absolute top-full left-0 w-full bg-background border-b border-border shadow-lg py-4 md:hidden flex flex-col px-4 gap-4"
          >
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-base font-medium py-2 text-foreground/80 hover:text-primary border-b border-border/50">
                {link.label}
              </Link>
            ))}
            <Link href="/contact" className="pt-2">
              <Button variant="default" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                Book a Consultation
              </Button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <span className="text-2xl font-bold tracking-tight text-white">
                Precise<span className="text-secondary">fect</span>
              </span>
            </Link>
            <p className="text-primary-foreground/70 mb-6 max-w-sm">
              Precision engineering meets perfect execution. We build operational systems for serious businesses.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4 text-white">Services</h3>
            <ul className="space-y-3">
              <li><Link href="/services/erp" className="text-primary-foreground/70 hover:text-white transition-colors">ERP Implementation</Link></li>
              <li><Link href="/services/automation" className="text-primary-foreground/70 hover:text-white transition-colors">Business Automation</Link></li>
              <li><Link href="/services" className="text-primary-foreground/70 hover:text-white transition-colors">Custom Integration</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 text-white">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-primary-foreground/70 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/case-studies" className="text-primary-foreground/70 hover:text-white transition-colors">Case Studies</Link></li>
              <li><Link href="/careers" className="text-primary-foreground/70 hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="/blog" className="text-primary-foreground/70 hover:text-white transition-colors">Insights</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 text-white">Contact</h3>
            <ul className="space-y-3">
              <li className="text-primary-foreground/70">hello@precisefect.com</li>
              <li className="text-primary-foreground/70">+1 (555) 123-4567</li>
              <li className="text-primary-foreground/70 pt-2">
                <Link href="/contact">
                  <span className="text-accent hover:underline font-medium">Get in touch &rarr;</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/50">
          <p>&copy; {new Date().getFullYear()} Precisefect Consulting. All rights reserved.</p>
          <div className="flex gap-6">
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
    <div className="min-h-[100dvh] flex flex-col flex-grow w-full">
      <Navbar />
      <main className="flex-grow flex flex-col pt-20 md:pt-24">{children}</main>
      <Footer />
    </div>
  );
}
