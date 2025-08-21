import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, Play, Calendar, MapPin, MessageCircle, Users, Heart } from "lucide-react";
import { Link, useLocation } from "wouter";
import Logo from "./logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [onlineMenuOpen, setOnlineMenuOpen] = useState(false);
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
            
            {/* Online Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center space-x-1 text-warm-gray hover:text-methodist-blue transition-colors"
                  data-testid="dropdown-online"
                >
                  <span>Online</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 bg-white shadow-lg border border-gray-200">
                <DropdownMenuItem 
                  className="flex items-center space-x-3 p-4 hover:bg-methodist-blue hover:text-white cursor-pointer"
                  onClick={() => window.open("https://www.facebook.com/BlessedUMC/live", "_blank")}
                  data-testid="menu-watch-live"
                >
                  <Play className="w-5 h-5 text-red-500" />
                  <div>
                    <div className="font-semibold">Watch Live Service</div>
                    <div className="text-sm text-gray-500">Join our Sunday worship online</div>
                  </div>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  className="flex items-center space-x-3 p-4 hover:bg-methodist-blue hover:text-white cursor-pointer"
                  onClick={() => window.open("https://www.facebook.com/BlessedUMC", "_blank")}
                  data-testid="menu-past-services"
                >
                  <Calendar className="w-5 h-5 text-methodist-blue" />
                  <div>
                    <div className="font-semibold">Past Services</div>
                    <div className="text-sm text-gray-500">Catch up on previous messages</div>
                  </div>
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  className="flex items-center space-x-3 p-4 hover:bg-methodist-blue hover:text-white cursor-pointer"
                  onClick={() => scrollToSection("about")}
                  data-testid="menu-online-giving"
                >
                  <Heart className="w-5 h-5 text-warm-gold" />
                  <div>
                    <div className="font-semibold">Online Giving</div>
                    <div className="text-sm text-gray-500">Support our ministry financially</div>
                  </div>
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  className="flex items-center space-x-3 p-4 hover:bg-methodist-blue hover:text-white cursor-pointer"
                  onClick={() => scrollToSection("contact")}
                  data-testid="menu-prayer-requests"
                >
                  <MessageCircle className="w-5 h-5 text-soft-green" />
                  <div>
                    <div className="font-semibold">Prayer Requests</div>
                    <div className="text-sm text-gray-500">Submit your prayer needs</div>
                  </div>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  className="flex items-center space-x-3 p-4 hover:bg-methodist-blue hover:text-white cursor-pointer"
                  onClick={() => scrollToSection("ministries")}
                  data-testid="menu-connect-groups"
                >
                  <Users className="w-5 h-5 text-methodist-blue" />
                  <div>
                    <div className="font-semibold">Connect Groups</div>
                    <div className="text-sm text-gray-500">Find community and fellowship</div>
                  </div>
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  className="flex items-center space-x-3 p-4 hover:bg-methodist-blue hover:text-white cursor-pointer"
                  onClick={() => window.open("https://goo.gl/maps/YOUR_CHURCH_LOCATION", "_blank")}
                  data-testid="menu-visit-location"
                >
                  <MapPin className="w-5 h-5 text-red-500" />
                  <div>
                    <div className="font-semibold">Visit Our Location</div>
                    <div className="text-sm text-gray-500">Find directions to our church</div>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <button
              onClick={() => scrollToSection("contact")}
              className="text-warm-gray hover:text-methodist-blue transition-colors"
            >
              Contact
            </button>

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
              
              {/* Mobile Online Menu */}
              <div className="py-1">
                <button
                  onClick={() => setOnlineMenuOpen(!onlineMenuOpen)}
                  className="flex items-center justify-between px-3 py-2 text-warm-gray w-full text-left"
                  data-testid="mobile-dropdown-online"
                >
                  <span>Online</span>
                  <ChevronDown className={`w-4 h-4 transform transition-transform ${onlineMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {onlineMenuOpen && (
                  <div className="pl-6 space-y-1 bg-gray-50">
                    <button
                      onClick={() => {
                        window.open("https://www.facebook.com/BlessedUMC/live", "_blank");
                        setMobileMenuOpen(false);
                        setOnlineMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 px-3 py-2 text-sm text-warm-gray w-full text-left hover:text-methodist-blue"
                      data-testid="mobile-menu-watch-live"
                    >
                      <Play className="w-4 h-4 text-red-500" />
                      <span>Watch Live Service</span>
                    </button>
                    <button
                      onClick={() => {
                        window.open("https://www.facebook.com/BlessedUMC", "_blank");
                        setMobileMenuOpen(false);
                        setOnlineMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 px-3 py-2 text-sm text-warm-gray w-full text-left hover:text-methodist-blue"
                      data-testid="mobile-menu-past-services"
                    >
                      <Calendar className="w-4 h-4 text-methodist-blue" />
                      <span>Past Services</span>
                    </button>
                    <button
                      onClick={() => {
                        scrollToSection("about");
                        setMobileMenuOpen(false);
                        setOnlineMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 px-3 py-2 text-sm text-warm-gray w-full text-left hover:text-methodist-blue"
                      data-testid="mobile-menu-online-giving"
                    >
                      <Heart className="w-4 h-4 text-warm-gold" />
                      <span>Online Giving</span>
                    </button>
                    <button
                      onClick={() => {
                        scrollToSection("contact");
                        setMobileMenuOpen(false);
                        setOnlineMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 px-3 py-2 text-sm text-warm-gray w-full text-left hover:text-methodist-blue"
                      data-testid="mobile-menu-prayer-requests"
                    >
                      <MessageCircle className="w-4 h-4 text-soft-green" />
                      <span>Prayer Requests</span>
                    </button>
                    <button
                      onClick={() => {
                        scrollToSection("ministries");
                        setMobileMenuOpen(false);
                        setOnlineMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 px-3 py-2 text-sm text-warm-gray w-full text-left hover:text-methodist-blue"
                      data-testid="mobile-menu-connect-groups"
                    >
                      <Users className="w-4 h-4 text-methodist-blue" />
                      <span>Connect Groups</span>
                    </button>
                    <button
                      onClick={() => {
                        window.open("https://goo.gl/maps/YOUR_CHURCH_LOCATION", "_blank");
                        setMobileMenuOpen(false);
                        setOnlineMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 px-3 py-2 text-sm text-warm-gray w-full text-left hover:text-methodist-blue"
                      data-testid="mobile-menu-visit-location"
                    >
                      <MapPin className="w-4 h-4 text-red-500" />
                      <span>Visit Our Location</span>
                    </button>
                  </div>
                )}
              </div>
              
              <button
                onClick={() => {
                  scrollToSection("contact");
                  setMobileMenuOpen(false);
                }}
                className="block px-3 py-2 text-warm-gray w-full text-left"
              >
                Contact
              </button>

            </div>
          </div>
        )}
      </nav>
    </header>
  );
}