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
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Church Name */}
          <Logo variant="header" size="md" />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('home')}
              className="text-methodist-blue font-medium hover:text-warm-gold transition-colors"
              data-testid="nav-home"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="text-warm-gray hover:text-methodist-blue transition-colors"
              data-testid="nav-about"
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('worship')}
              className="text-warm-gray hover:text-methodist-blue transition-colors"
              data-testid="nav-worship"
            >
              Worship
            </button>
            <button 
              onClick={() => scrollToSection('ministries')}
              className="text-warm-gray hover:text-methodist-blue transition-colors"
              data-testid="nav-ministries"
            >
              Ministries
            </button>
            <button 
              onClick={() => scrollToSection('events')}
              className="text-warm-gray hover:text-methodist-blue transition-colors"
              data-testid="nav-events"
            >
              Events
            </button>
            <Link 
              href="/umyf"
              className={`${location === '/umyf' ? 'text-methodist-blue font-medium' : 'text-warm-gray hover:text-methodist-blue'} transition-colors`}
              data-testid="nav-umyf"
            >
              UMYF
            </Link>
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-warm-gray hover:text-methodist-blue transition-colors"
              data-testid="nav-contact"
            >
              Contact
            </button>
            <Button 
              className="bg-methodist-blue text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-all"
              data-testid="button-plan-visit"
            >
              Plan a Visit
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? (
              <X className="text-methodist-blue text-xl" />
            ) : (
              <Menu className="text-methodist-blue text-xl" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t" data-testid="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button 
                onClick={() => scrollToSection('home')}
                className="block px-3 py-2 text-methodist-blue font-medium w-full text-left"
                data-testid="mobile-nav-home"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="block px-3 py-2 text-warm-gray w-full text-left"
                data-testid="mobile-nav-about"
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection('worship')}
                className="block px-3 py-2 text-warm-gray w-full text-left"
                data-testid="mobile-nav-worship"
              >
                Worship
              </button>
              <button 
                onClick={() => scrollToSection('ministries')}
                className="block px-3 py-2 text-warm-gray w-full text-left"
                data-testid="mobile-nav-ministries"
              >
                Ministries
              </button>
              <button 
                onClick={() => scrollToSection('events')}
                className="block px-3 py-2 text-warm-gray w-full text-left"
                data-testid="mobile-nav-events"
              >
                Events
              </button>
              <Link 
                href="/umyf"
                className={`block px-3 py-2 w-full text-left ${location === '/umyf' ? 'text-methodist-blue font-medium' : 'text-warm-gray'}`}
                data-testid="mobile-nav-umyf"
                onClick={() => setMobileMenuOpen(false)}
              >
                UMYF
              </Link>
              <button 
                onClick={() => scrollToSection('contact')}
                className="block px-3 py-2 text-warm-gray w-full text-left"
                data-testid="mobile-nav-contact"
              >
                Contact
              </button>
              <Button 
                className="w-full mt-3 bg-methodist-blue text-white px-6 py-2 rounded-lg"
                data-testid="mobile-button-plan-visit"
              >
                Plan a Visit
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
