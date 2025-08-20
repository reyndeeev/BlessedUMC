            import { useState } from "react";
            import { Menu, X, Home } from "lucide-react";
            import { Link } from "wouter";
            import Logo from "./logo";

            export default function UMYFheader() {
              const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

              const scrollToSection = (sectionId: string) => {
                const element = document.getElementById(sectionId);
                if (!element) return;

                const headerOffset = 56; // Height of UMYF header only
                const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerOffset;

                const startPosition = window.pageYOffset;
                const distance = offsetPosition - startPosition;
                const duration = 800; // Smooth scroll duration

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
                <header className="sticky top-0 z-50 bg-methodist-blue/30 backdrop-blur-md border-b border-white/20 shadow-sm">
                  <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-14">
                      {/* Logo */}
                      <div
                        className="cursor-pointer flex items-center space-x-3"
                        onClick={() => scrollToSection("about")}
                      >
                        <img 
                          src="https://cdn.discordapp.com/attachments/948276718609772597/1407790711054799010/lllAcgAAAAZJREFUAwCMaEhuxYNxJwAAAABJRU5ErkJggg.png?ex=68a762c5&is=68a61145&hm=41724f25a2579387d9f1e87f885fbe61a08de5c33df7ab5cdfe3b771274e4783&"
                          alt="UMYF Logo" 
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <span className="text-white font-semibold text-lg">BLESSED UMYF</span>
                      </div>

                      {/* Desktop Menu */}
                      <div className="hidden md:flex items-center space-x-6 text-white font-medium">
                        <Link
                          href="/"
                          className="flex items-center space-x-1 text-white hover:text-warm-gold transition"
                        >
                          <Home className="w-4 h-4" />
                          <span>Home</span>
                        </Link>
                        <button
                          onClick={() => scrollToSection("about")}
                          className="text-white hover:text-warm-gold transition"
                        >
                          About
                        </button>
                        <button
                          onClick={() => scrollToSection("activities")}
                          className="text-white hover:text-warm-gold transition"
                        >
                          Activities
                        </button>
                        <button
                          onClick={() => scrollToSection("contact")}
                          className="text-white hover:text-warm-gold transition"
                        >
                          Contact
                        </button>
                      </div>

                      {/* Mobile Menu Button */}
                      <button
                        className="md:hidden p-2"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                      >
                        {mobileMenuOpen ? (
                          <X className="text-white w-5 h-5" />
                        ) : (
                          <Menu className="text-white w-5 h-5" />
                        )}
                      </button>
                    </div>

                    {/* Mobile Dropdown */}
                    {mobileMenuOpen && (
                      <div className="md:hidden bg-methodist-blue/70 backdrop-blur-md text-white px-4 py-5 space-y-3 shadow-lg">
                        <Link
                          href="/"
                          className="flex items-center space-x-2 w-full text-left text-white hover:text-warm-gold transition"
                        >
                          <Home className="w-4 h-4" />
                          <span>Home</span>
                        </Link>
                        <button
                          onClick={() => scrollToSection("about")}
                          className="block w-full text-left text-white hover:text-warm-gold transition"
                        >
                          About
                        </button>
                        <button
                          onClick={() => scrollToSection("activities")}
                          className="block w-full text-left text-white hover:text-warm-gold transition"
                        >
                          Activities
                        </button>
                        <button
                          onClick={() => scrollToSection("contact")}
                          className="block w-full text-left text-white hover:text-warm-gold transition"
                        >
                          Contact
                        </button>
                      </div>
                    )}
                  </nav>
                </header>
              );
            }