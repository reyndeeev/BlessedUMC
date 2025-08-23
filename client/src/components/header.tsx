import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, Home, Users, Heart, Calendar, Phone } from 'lucide-react';
import { Button } from './ui/button';
import Logo from './logo';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const closeMenu = () => setIsMenuOpen(false);

  const scrollToSection = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      closeMenu();
    }
  };

  const navItems = [
    {
      label: 'Home',
      href: '/',
      icon: Home,
      onClick: () => {
        if (location === '/') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        closeMenu();
      }
    },
    {
      label: 'About',
      href: '/about',
      icon: Heart,
      onClick: () => {
        if (location === '/') {
          scrollToSection('about');
        } else {
          closeMenu();
        }
      }
    },
    {
      label: 'Ministries',
      href: '/ministries',
      icon: Users,
      onClick: closeMenu
    },
    {
      label: 'UMYF',
      href: '/umyf',
      icon: Users,
      onClick: closeMenu
    },
    {
      label: 'Contact',
      href: '/',
      icon: Phone,
      onClick: () => {
        if (location === '/') {
          scrollToSection('contact');
        } else {
          closeMenu();
        }
      }
    }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" onClick={() => { closeMenu(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            <Logo
              variant={isScrolled ? "header" : "header-transparent"}
              size="lg"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;

              return (
                <Link key={item.label} href={item.href}>
                  <button
                    onClick={item.onClick}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 font-medium ${
                      isScrolled
                        ? isActive
                          ? 'text-methodist-blue bg-methodist-blue/10'
                          : 'text-gray-700 hover:text-methodist-blue hover:bg-methodist-blue/5'
                        : isActive
                          ? 'text-warm-gold bg-white/20 backdrop-blur-sm'
                          : 'text-white hover:text-warm-gold hover:bg-white/10 backdrop-blur-sm'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </button>
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className={`md:hidden ${
              isScrolled
                ? 'text-gray-700 hover:text-methodist-blue'
                : 'text-white hover:text-warm-gold'
            }`}
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md shadow-xl border-t border-gray-200">
            <nav className="px-4 py-6 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.href;

                return (
                  <Link key={item.label} href={item.href}>
                    <button
                      onClick={item.onClick}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium text-left ${
                        isActive
                          ? 'text-methodist-blue bg-methodist-blue/10 shadow-sm'
                          : 'text-gray-700 hover:text-methodist-blue hover:bg-methodist-blue/5'
                      }`}
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </button>
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Contact Info */}
            <div className="px-4 pb-6 pt-4 border-t border-gray-200">
              <div className="text-center text-sm text-gray-600">
                <p className="mb-2">Join us Sundays at 9:00 AM</p>
                <div className="flex justify-center space-x-4">
                  <Button
                    onClick={() => {
                      window.open('https://www.facebook.com/profile.php?id=61556573281040', '_blank');
                      closeMenu();
                    }}
                    size="sm"
                    className="bg-methodist-blue hover:bg-methodist-blue/90 text-white"
                  >
                    Follow Us
                  </Button>
                  <Button
                    onClick={() => {
                      scrollToSection('contact');
                    }}
                    size="sm"
                    variant="outline"
                    className="border-methodist-blue text-methodist-blue hover:bg-methodist-blue/5"
                  >
                    Contact
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}