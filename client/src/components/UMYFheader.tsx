            import { useState } from "react";
            import { Menu, X, Home, Info, Calendar, MessageCircle, Users } from "lucide-react";
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
                <header className="sticky top-0 z-50 bg-black/50 backdrop-blur-md border-b border-white/10 shadow-sm">
                  <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                      {/* Logo */}
                      <div
                        className="cursor-pointer flex items-center space-x-3"
                        onClick={() => scrollToSection("about")}
                      >
                        <img 
                          src="https://s3.amazonaws.com/Website_Properties/Resources/graphics-library/Cross_Flame_CLR.png"
                          alt="UMYF Logo" 
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex flex-col">
                          <h1 className="text-xl md:text-2xl font-heading font-extrabold tracking-tight text-white leading-none">
                            BLESSED
                          </h1>
                          <p className="text-sm md:text-base text-gray-300 font-medium tracking-wide leading-tight">
                            United Methodist Youth Fellowship
                          </p>
                        </div>
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
                        <Link
                          href="/myaf"
                          className="flex items-center space-x-1 text-white hover:text-warm-gold transition"
                        >
                          <Users className="w-4 h-4" />
                          <span>MYAF</span>
                        </Link>
                        <button
                          onClick={() => scrollToSection("about")}
                          className="flex items-center space-x-1 text-white hover:text-warm-gold transition"
                        >
                          <Info className="w-4 h-4" />
                          <span>About</span>
                        </button>
                        <button
                          onClick={() => scrollToSection("activities")}
                          className="flex items-center space-x-1 text-white hover:text-warm-gold transition"
                        >
                          <Calendar className="w-4 h-4" />
                          <span>Activities</span>
                        </button>
                        <button
                          onClick={() => scrollToSection("contact")}
                          className="flex items-center space-x-1 text-white hover:text-warm-gold transition"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Contact</span>
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
                      <div className="md:hidden bg-black/70 backdrop-blur-md text-white px-4 py-5 space-y-3 shadow-lg">
                        <Link
                          href="/"
                          className="flex items-center space-x-2 w-full text-left text-white hover:text-warm-gold transition"
                        >
                          <Home className="w-4 h-4" />
                          <span>Home</span>
                        </Link>
                        <Link
                          href="/myaf"
                          className="flex items-center space-x-2 w-full text-left text-white hover:text-warm-gold transition"
                        >
                          <Users className="w-4 h-4" />
                          <span>MYAF</span>
                        </Link>
                        <button
                          onClick={() => scrollToSection("about")}
                          className="flex items-center space-x-2 w-full text-left text-white hover:text-warm-gold transition"
                        >
                          <Info className="w-4 h-4" />
                          <span>About</span>
                        </button>
                        <button
                          onClick={() => scrollToSection("activities")}
                          className="flex items-center space-x-2 w-full text-left text-white hover:text-warm-gold transition"
                        >
                          <Calendar className="w-4 h-4" />
                          <span>Activities</span>
                        </button>
                        <button
                          onClick={() => scrollToSection("contact")}
                          className="flex items-center space-x-2 w-full text-left text-white hover:text-warm-gold transition"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Contact</span>
                        </button>
                      </div>
                    )}
                  </nav>
                </header>
              );
            }