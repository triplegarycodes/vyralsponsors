import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Modules", path: "/modules" },
  { name: "Neo", path: "/neo" },
  { name: "Vision", path: "/vision" },
  { name: "Sponsors", path: "/sponsors" },
];

const vyralViewLink = { name: "VYRAL VIEW", path: "/vyral-view" };

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl transition-all duration-300 ${
          isScrolled
            ? "glass rounded-2xl shadow-lg shadow-primary/10"
            : "bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative"
            >
              <span className="font-display text-2xl font-bold gradient-text">
                VYRAL
              </span>
              <motion.div
                className="absolute -inset-2 bg-primary/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity"
                layoutId="logo-glow"
              />
            </motion.div>
          </Link>

          {/* VYRAL VIEW Link - Adjacent to Logo */}
          <Link
            to={vyralViewLink.path}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/30 hover:bg-primary/20 transition-all duration-300 ml-2"
          >
            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
            <span className="text-xs font-display font-semibold text-primary">
              {vyralViewLink.name}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="relative px-4 py-2 group"
              >
                <span
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.name}
                </span>
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link to="/support">
              <Button
                variant="outline"
                className="border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 neon-glow"
              >
                Join Waitlist
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-foreground"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-4 top-24 z-40 glass rounded-2xl p-6 md:hidden"
          >
            <div className="flex flex-col gap-2">
              {/* VYRAL VIEW Link - Featured at top */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Link
                  to={vyralViewLink.path}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl text-lg font-medium transition-colors ${
                    location.pathname === vyralViewLink.path
                      ? "bg-primary/20 text-primary"
                      : "bg-accent/10 text-accent border border-accent/30 hover:bg-accent/20"
                  }`}
                >
                  <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                  {vyralViewLink.name}
                </Link>
              </motion.div>
              
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (index + 1) * 0.05 }}
                >
                  <Link
                    to={link.path}
                    className={`block px-4 py-3 rounded-xl text-lg font-medium transition-colors ${
                      location.pathname === link.path
                        ? "bg-primary/20 text-primary"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.05 }}
                className="mt-4"
              >
                <Link to="/support" className="block">
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Join Waitlist
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
