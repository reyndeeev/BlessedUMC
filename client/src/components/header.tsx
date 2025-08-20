import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "wouter";
import Logo from "./logo";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (!element) return;

    const headerOffset = 80; // Height of this header (64px)
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - headerOffset;

    const startPosition = window.pageYOffset;
    const distance = offsetPosition - startPosition;
    const duration = 800;

    let start: number | null = null;

    const easeInOutQuad = (t: number) =>
      t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    function step(timestamp: number) {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const percent = Math.min(progress / duration, 1);
      const ease = easeInOutQuad(percent);
      window.scrollTo(0, startPosition + distance * ease);
      if (progress < duration) {
        window.requestAnimationFrame(step);
      }
    }

    window.requestAnimationFrame(step);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center" data-testid="logo-home-link">
            <Logo variant="header" size="md" />
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => {
                if (location !== "/") {
                  window.location.href = "/";
                } else {
                  scrollToSection("home");
                }
              }}
              className={`${location === "/" ? "text-methodist-blue font-medium" : "text-warm-gray hover:text-methodist-blue"} transition-colors`}
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="text-warm-gray hover:text-methodist-blue transition-colors"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("worship")}
              className="text-warm-gray hover:text-methodist-blue transition-colors"
            >
              Worship
            </button>
            <button
              onClick={() => scrollToSection("ministries")}
              className="text-warm-gray hover:text-methodist-blue transition-colors"
            >
              Ministries
            </button>
            <button
              onClick={() => scrollToSection("events")}
              className="text-warm-gray hover:text-methodist-blue transition-colors"
            >
              Events
            </button>
            <Link
              href="/umyf"
              className={`${location === "/umyf" ? "text-methodist-blue font-medium" : "text-warm-gray hover:text-methodist-blue"} transition-colors`}
            >
              UMYF
            </Link>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-warm-gray hover:text-methodist-blue transition-colors"
            >
              Contact
            </button>
            <Button className="bg-methodist-blue text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-all">
              Plan a Visit
            </Button>
          </div>

          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="text-methodist-blue text-xl" /> : <Menu className="text-methodist-blue text-xl" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button
                onClick={() => {
                  location !== "/" ? window.location.href = "/" : scrollToSection("home");
                  setMobileMenuOpen(false);
                }}
                className={`block px-3 py-2 w-full text-left ${location === "/" ? "text-methodist-blue font-medium" : "text-warm-gray"}`}
              >
                Home
              </button>
              <button
                onClick={() => {
                  scrollToSection("about");
                  setMobileMenuOpen(false);
                }}
                className="block px-3 py-2 text-warm-gray w-full text-left"
              >
                About
              </button>
              <button
                onClick={() => {
                  scrollToSection("worship");
                  setMobileMenuOpen(false);
                }}
                className="block px-3 py-2 text-warm-gray w-full text-left"
              >
                Worship
              </button>
              <button
                onClick={() => {
                  scrollToSection("ministries");
                  setMobileMenuOpen(false);
                }}
                className="block px-3 py-2 text-warm-gray w-full text-left"
              >
                Ministries
              </button>
              <button
                onClick={() => {
                  scrollToSection("events");
                  setMobileMenuOpen(false);
                }}
                className="block px-3 py-2 text-warm-gray w-full text-left"
              >
                Events
              </button>
              <Link
                href="/umyf"
                className={`block px-3 py-2 w-full text-left ${location === "/umyf" ? "text-methodist-blue font-medium" : "text-warm-gray"}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                UMYF
              </Link>
              <button
                onClick={() => {
                  scrollToSection("contact");
                  setMobileMenuOpen(false);
                }}
                className="block px-3 py-2 text-warm-gray w-full text-left"
              >
                Contact
              </button>
              <Button className="w-full mt-3 bg-methodist-blue text-white px-6 py-2 rounded-lg">
                Plan a Visit
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}