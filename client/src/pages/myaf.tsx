
import { useEffect, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Calendar, Clock, Users, Heart, BookOpen, Music, ArrowUp, Menu, X, Home, Info, MessageCircle } from "lucide-react";
import { Link } from "wouter";

export default function MYAF() {
  const [showBackButton, setShowBackButton] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMoreMYAF, setShowMoreMYAF] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleScroll = () => setShowBackButton(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const scrollToTop = () => {
    const startPosition = window.pageYOffset;
    const distance = -startPosition;
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
  };

  return (
    <div className="font-sans bg-gray-50 min-h-screen flex flex-col">
      {/* MYAF-Specific Header */}
      <header className="sticky top-0 z-50 bg-black/50 backdrop-blur-md border-b border-white/10 shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div
              className="cursor-pointer flex items-center space-x-3"
              onClick={() => scrollToSection("about")}
            >
              <img 
                src="https://cdn.discordapp.com/attachments/948276718609772597/1407790711054799010/lllAcgAAAAZJREFUAwCMaEhuxYNxJwAAAABJRU5ErkJggg.png?ex=68aaae85&is=68a95d05&hm=bf236b3263e79c62443a14dcc26db24393ab5b086e6786ba94139007fd4bff21&"
                alt="MYAF Logo" 
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex flex-col">
                <h1 className="text-xl md:text-2xl font-heading font-extrabold tracking-tight text-white leading-none">
                  BLESSED
                </h1>
                <p className="text-sm md:text-base text-gray-300 font-medium tracking-wide leading-tight">
                  Methodist Young Adult Fellowship
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
              <button
                onClick={() => scrollToSection("about")}
                className="flex items-center space-x-1 text-white hover:text-warm-gold transition"
              >
                <Info className="w-4 h-4" />
                <span>About</span>
              </button>
              <button
                onClick={() => scrollToSection("gallery")}
                className="flex items-center space-x-1 text-white hover:text-warm-gold transition"
              >
                <Calendar className="w-4 h-4" />
                <span>Gallery</span>
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
              <button
                onClick={() => scrollToSection("about")}
                className="flex items-center space-x-2 w-full text-left text-white hover:text-warm-gold transition"
              >
                <Info className="w-4 h-4" />
                <span>About</span>
              </button>
              <button
                onClick={() => scrollToSection("gallery")}
                className="flex items-center space-x-2 w-full text-left text-white hover:text-warm-gold transition"
              >
                <Calendar className="w-4 h-4" />
                <span>Gallery</span>
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

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center" id="home">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(27, 54, 93, 0.8) 0%, rgba(60, 30, 120, 0.6) 25%, rgba(0, 0, 0, 0.7) 50%, rgba(139, 69, 19, 0.5) 75%, rgba(27, 54, 93, 0.8) 100%), radial-gradient(ellipse at center, rgba(255, 255, 255, 0.1) 0%, transparent 70%), url('https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1200&h=800&fit=crop')`,
          }}
        />
        <div className="relative z-10 text-center text-white max-w-6xl mx-auto px-4">
          <div className="mb-8">
            <h3 className="font-heading text-lg md:text-xl font-medium tracking-wide text-warm-gold uppercase mb-4">
              Welcome to
            </h3>
            <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-black mb-2 leading-none tracking-tight">
              BLESSED
            </h1>
            <h2 className="font-heading text-xl md:text-3xl lg:text-4xl font-black mb-6 leading-none tracking-tight text-blue-100">
              METHODIST YOUNG ADULT FELLOWSHIP
            </h2>
            <p className="text-2xl md:text-3xl lg:text-4xl font-heading font-light tracking-wide text-blue-100">
              Growing Together In Faith & Purpose
            </p>
          </div>
          
          <p className="text-lg md:text-xl mb-12 font-light max-w-2xl mx-auto leading-relaxed opacity-90">
            A vibrant community for young adults (18-35) seeking to deepen their faith, build meaningful relationships, and make a difference in the world.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button
              onClick={() => scrollToSection("activities")}
              className="bg-white text-methodist-blue px-10 py-5 rounded-full text-lg font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
            >
              <Users className="mr-3 h-6 w-6" />
              Join Our Community
            </Button>
            
            <Button
              onClick={() => window.open("https://www.facebook.com/BlessedUMCYoungAdults", "_blank")}
              variant="outline"
              className="border-3 border-warm-gold text-warm-gold bg-transparent px-10 py-5 rounded-full text-lg font-bold hover:bg-warm-gold hover:text-methodist-blue transition-all transform hover:scale-105"
            >
              <Heart className="mr-3 h-6 w-6" />
              Connect With Us
            </Button>
          </div>
          
          <div className="mt-16 flex flex-wrap justify-center gap-6 text-sm font-medium">
            <button 
              onClick={() => scrollToSection('activities')}
              className="text-blue-200 hover:text-white transition-colors underline underline-offset-4"
            >
              Young Adult Activities
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="text-blue-200 hover:text-white transition-colors underline underline-offset-4"
            >
              About MYAF
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-blue-200 hover:text-white transition-colors underline underline-offset-4"
            >
              Get Involved
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-gradient-to-br from-white via-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="font-heading text-sm font-bold tracking-wide text-methodist-blue uppercase mb-4">
              Young Adult Fellowship
            </h3>
            <h2 className="text-5xl lg:text-6xl font-heading font-black text-gray-900 mb-6 leading-tight tracking-tight">
              About BLESSED MYAF
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A thriving community where young adults discover their calling, build authentic relationships, and impact the world for Christ.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-heading text-2xl font-black text-gray-900 mb-4 tracking-tight">Spiritual Growth</h3>
                <p className="text-gray-600 leading-relaxed">
                  Deepening our walk with God through Bible study, prayer, worship, and mentorship opportunities designed for young adults navigating life's transitions.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-heading text-2xl font-black text-gray-900 mb-4 tracking-tight">Life & Career</h3>
                <p className="text-gray-600 leading-relaxed">
                  Supporting each other through career development, relationships, financial stewardship, and major life decisions with biblical wisdom and practical guidance.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Music className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-heading text-2xl font-black text-gray-900 mb-4 tracking-tight">Community & Service</h3>
                <p className="text-gray-600 leading-relaxed">
                  Building lasting friendships while serving our community through outreach programs, mission trips, and social justice initiatives that reflect God's love.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section with Unique Grid Layout */}
      <section id="gallery" className="py-20 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="font-heading text-sm font-bold tracking-wide text-orange-600 uppercase mb-4">
              Our Community
            </h3>
            <h2 className="text-5xl lg:text-6xl font-heading font-black text-gray-900 mb-6 leading-tight tracking-tight">
              MYAF Gallery
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Witness our journey of faith, friendship, and service through these precious moments shared together.
            </p>
          </div>
          
          {/* Featured Highlight Section */}
          <div className="mb-16">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=1200&h=600&fit=crop" 
                alt="MYAF Group Photo"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-methodist-blue/80 via-transparent to-orange-600/80">
                <div className="absolute bottom-8 left-8 text-white">
                  <h3 className="font-heading text-3xl font-black mb-2">United in Faith</h3>
                  <p className="text-lg">Our MYAF family growing stronger together</p>
                </div>
              </div>
            </div>
          </div>

          {/* Unique Grid Layout - Different from UMYF */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-12">
            {/* Row 1 - Mixed sizes */}
            <div className="col-span-2 row-span-2 relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
              <img 
                src="https://images.unsplash.com/photo-1540479859555-17af45c78602?w=600&h=600&fit=crop" 
                alt="Community Service Project"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-orange-600/0 group-hover:bg-orange-600/20 transition-colors duration-300">
                <div className="absolute bottom-3 left-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h4 className="font-bold">Community Service</h4>
                </div>
              </div>
            </div>

            <div className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
              <img 
                src="https://images.unsplash.com/photo-1529390079861-591de354faf5?w=300&h=300&fit=crop" 
                alt="Fellowship Dinner"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-orange-600/0 group-hover:bg-orange-600/20 transition-colors duration-300">
                <div className="absolute bottom-2 left-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-sm font-medium">Fellowship</p>
                </div>
              </div>
            </div>

            <div className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
              <img 
                src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=300&h=300&fit=crop" 
                alt="Worship Night"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-orange-600/0 group-hover:bg-orange-600/20 transition-colors duration-300">
                <div className="absolute bottom-2 left-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-sm font-medium">Worship</p>
                </div>
              </div>
            </div>

            <div className="col-span-2 relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
              <img 
                src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600&h=300&fit=crop" 
                alt="Annual Retreat"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-orange-600/0 group-hover:bg-orange-600/20 transition-colors duration-300">
                <div className="absolute bottom-2 left-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-sm font-medium">Annual Retreat</p>
                </div>
              </div>
            </div>

            {/* Row 2 - Continuing grid */}
            <div className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
              <img 
                src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=300&h=300&fit=crop" 
                alt="Game Night"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-orange-600/0 group-hover:bg-orange-600/20 transition-colors duration-300">
                <div className="absolute bottom-2 left-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-sm font-medium">Game Night</p>
                </div>
              </div>
            </div>

            <div className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
              <img 
                src="https://images.unsplash.com/photo-1519333471862-2c7496ba58a3?w=300&h=300&fit=crop" 
                alt="Mission Trip"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-orange-600/0 group-hover:bg-orange-600/20 transition-colors duration-300">
                <div className="absolute bottom-2 left-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-sm font-medium">Missions</p>
                </div>
              </div>
            </div>

            <div className="col-span-2 relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
              <img 
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=300&fit=crop" 
                alt="Conference"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-orange-600/0 group-hover:bg-orange-600/20 transition-colors duration-300">
                <div className="absolute bottom-2 left-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-sm font-medium">Conferences</p>
                </div>
              </div>
            </div>

            {/* Row 3 - More varied layouts */}
            <div className="col-span-3 relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
              <img 
                src="https://images.unsplash.com/photo-1552581234-26160f608093?w=900&h=400&fit=crop" 
                alt="Community Outreach"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-orange-600/0 group-hover:bg-orange-600/20 transition-colors duration-300">
                <div className="absolute bottom-3 left-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h4 className="font-bold">Local Outreach</h4>
                  <p className="text-sm">Serving our neighbors</p>
                </div>
              </div>
            </div>

            <div className="col-span-2 row-span-2 relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
              <img 
                src="https://images.unsplash.com/photo-1509909756405-be0199881695?w=600&h=800&fit=crop" 
                alt="Worship Team"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-orange-600/0 group-hover:bg-orange-600/20 transition-colors duration-300">
                <div className="absolute bottom-3 left-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h4 className="font-bold">Worship Ministry</h4>
                  <p className="text-sm">Leading hearts to God</p>
                </div>
              </div>
            </div>

            <div className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
              <img 
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=400&fit=crop" 
                alt="Prayer Circle"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-orange-600/0 group-hover:bg-orange-600/20 transition-colors duration-300">
                <div className="absolute bottom-2 left-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-sm font-medium">Prayer</p>
                </div>
              </div>
            </div>

            <div className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
              <img 
                src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=300&h=400&fit=crop" 
                alt="Bible Study"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-orange-600/0 group-hover:bg-orange-600/20 transition-colors duration-300">
                <div className="absolute bottom-2 left-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-sm font-medium">Bible Study</p>
                </div>
              </div>
            </div>

            <div className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
              <img 
                src="https://images.unsplash.com/photo-1540479859555-17af45c78602?w=300&h=400&fit=crop" 
                alt="Youth Activities"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-orange-600/0 group-hover:bg-orange-600/20 transition-colors duration-300">
                <div className="absolute bottom-2 left-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-sm font-medium">Activities</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Featured Row */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="relative group rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
              <img 
                src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=500&fit=crop" 
                alt="Sunday Service"
                className="w-full h-64 md:h-80 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-orange-600/60 to-transparent">
                <div className="absolute bottom-4 left-4 text-white">
                  <h4 className="font-bold text-lg mb-1">Sunday Gatherings</h4>
                  <p className="text-sm">Weekly fellowship after service</p>
                </div>
              </div>
            </div>

            <div className="relative group rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
              <img 
                src="https://images.unsplash.com/photo-1529390079861-591de354faf5?w=400&h=500&fit=crop" 
                alt="Social Events"
                className="w-full h-64 md:h-80 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-orange-600/60 to-transparent">
                <div className="absolute bottom-4 left-4 text-white">
                  <h4 className="font-bold text-lg mb-1">Social Events</h4>
                  <p className="text-sm">Building friendships that last</p>
                </div>
              </div>
            </div>

            <div className="relative group rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
              <img 
                src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400&h=500&fit=crop" 
                alt="Spiritual Growth"
                className="w-full h-64 md:h-80 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-orange-600/60 to-transparent">
                <div className="absolute bottom-4 left-4 text-white">
                  <h4 className="font-bold text-lg mb-1">Spiritual Growth</h4>
                  <p className="text-sm">Deepening our walk with Christ</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Additional Gallery Section with Show More */}
          {showMoreMYAF && (
            <div className="mb-12 animate-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-2xl font-heading font-bold text-orange-800 mb-8 text-center">More MYAF Adventures</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                <div className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                  <img 
                    src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=300&fit=crop" 
                    alt="MYAF Leadership Training"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-orange-600/0 group-hover:bg-orange-600/20 transition-colors duration-300">
                    <div className="absolute bottom-2 left-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-sm font-medium">Leadership</p>
                    </div>
                  </div>
                </div>

                <div className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                  <img 
                    src="https://images.unsplash.com/photo-1600298881974-6be191ceeda1?w=300&h=300&fit=crop" 
                    alt="MYAF Community Service"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-orange-600/0 group-hover:bg-orange-600/20 transition-colors duration-300">
                    <div className="absolute bottom-2 left-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-sm font-medium">Service</p>
                    </div>
                  </div>
                </div>

                <div className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                  <img 
                    src="https://images.unsplash.com/photo-1573164713712-03790a178651?w=300&h=300&fit=crop" 
                    alt="MYAF Professional Development"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-orange-600/0 group-hover:bg-orange-600/20 transition-colors duration-300">
                    <div className="absolute bottom-2 left-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-sm font-medium">Career Dev</p>
                    </div>
                  </div>
                </div>

                <div className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                  <img 
                    src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=300&h=300&fit=crop" 
                    alt="MYAF Conference"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-orange-600/0 group-hover:bg-orange-600/20 transition-colors duration-300">
                    <div className="absolute bottom-2 left-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-sm font-medium">Conferences</p>
                    </div>
                  </div>
                </div>

                <div className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                  <img 
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300&h=300&fit=crop" 
                    alt="MYAF Team Building"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-orange-600/0 group-hover:bg-orange-600/20 transition-colors duration-300">
                    <div className="absolute bottom-2 left-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-sm font-medium">Team Building</p>
                    </div>
                  </div>
                </div>

                <div className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                  <img 
                    src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=300&h=300&fit=crop" 
                    alt="MYAF Networking"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-orange-600/0 group-hover:bg-orange-600/20 transition-colors duration-300">
                    <div className="absolute bottom-2 left-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-sm font-medium">Networking</p>
                    </div>
                  </div>
                </div>

                <div className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                  <img 
                    src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=300&h=300&fit=crop" 
                    alt="MYAF Social Activities"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-orange-600/0 group-hover:bg-orange-600/20 transition-colors duration-300">
                    <div className="absolute bottom-2 left-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-sm font-medium">Social Events</p>
                    </div>
                  </div>
                </div>

                <div className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                  <img 
                    src="https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=300&h=300&fit=crop" 
                    alt="MYAF Mentorship"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-orange-600/0 group-hover:bg-orange-600/20 transition-colors duration-300">
                    <div className="absolute bottom-2 left-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-sm font-medium">Mentorship</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="relative group rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
                  <img 
                    src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&h=400&fit=crop" 
                    alt="MYAF Workshop"
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-orange-600/60 to-transparent">
                    <div className="absolute bottom-4 left-4 text-white">
                      <h4 className="font-bold text-lg mb-1">Skills Workshops</h4>
                      <p className="text-sm">Building practical life skills together</p>
                    </div>
                  </div>
                </div>

                <div className="relative group rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
                  <img 
                    src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=400&fit=crop" 
                    alt="MYAF Small Groups"
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-orange-600/60 to-transparent">
                    <div className="absolute bottom-4 left-4 text-white">
                      <h4 className="font-bold text-lg mb-1">Small Groups</h4>
                      <p className="text-sm">Deeper connections and accountability</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Show More/Less Button */}
          <div className="text-center mb-12">
            <Button
              onClick={() => setShowMoreMYAF(!showMoreMYAF)}
              className="bg-orange-600 text-white px-8 py-3 rounded-full font-bold hover:bg-orange-700 transition-all transform hover:scale-105 shadow-lg"
            >
              {showMoreMYAF ? 'Show Less' : 'Show More Photos'} 
              <span className="ml-2">{showMoreMYAF ? '↑' : '↓'}</span>
            </Button>
          </div>

          {/* Gallery CTA */}
          <div className="text-center">
            <div className="bg-white rounded-3xl p-8 shadow-xl max-w-2xl mx-auto">
              <h3 className="font-heading text-2xl font-bold text-gray-900 mb-4">Want to Join Our Community?</h3>
              <p className="text-gray-600 mb-6">Follow us on social media to see more of our adventures and stay connected with our MYAF family!</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => window.open("https://www.facebook.com/BlessedMYAF", "_blank")}
                  className="bg-orange-600 text-white px-6 py-3 rounded-full font-bold hover:bg-orange-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  Follow Us on Facebook
                </Button>
                <Button
                  onClick={() => scrollToSection("contact")}
                  variant="outline"
                  className="border-2 border-orange-600 text-orange-600 px-6 py-3 rounded-full font-bold hover:bg-orange-600 hover:text-white transition-all transform hover:scale-105"
                >
                  Get In Touch
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section id="activities" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-heading font-bold text-methodist-blue mb-8">
                When We Meet
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Calendar className="w-6 h-6 text-warm-gold mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold text-methodist-blue mb-2">Sunday Young Adult Group</h3>
                    <p className="text-warm-gray mb-1">Every Sunday after worship service</p>
                    <p className="text-warm-gray">12:00 PM - 1:30 PM</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Clock className="w-6 h-6 text-warm-gold mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold text-methodist-blue mb-2">Weekly Bible Study</h3>
                    <p className="text-warm-gray mb-1">Wednesday Evenings</p>
                    <p className="text-warm-gray">7:00 PM - 8:30 PM</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <BookOpen className="w-6 h-6 text-warm-gold mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold text-methodist-blue mb-2">Monthly Service Projects</h3>
                    <p className="text-warm-gray mb-1">Community outreach and service</p>
                    <p className="text-warm-gray">Second Saturday of each month</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-heading font-bold text-methodist-blue mb-8">Upcoming Events</h2>
              <div className="space-y-4">
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-blue-800">Career Development Workshop</CardTitle>
                    <CardDescription className="text-blue-600">Professional growth and networking</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-blue-700">Join us for a workshop on career development, resume building, and networking strategies.</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="text-green-800">Community Service Day</CardTitle>
                    <CardDescription className="text-green-600">Serving our local community</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-green-700">Make a difference in our community through various service projects and outreach activities.</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
                  <CardHeader>
                    <CardTitle className="text-purple-800">Young Adult Retreat</CardTitle>
                    <CardDescription className="text-purple-600">Spiritual growth and fellowship</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-purple-700">A weekend retreat focused on spiritual growth, community building, and fun activities.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-white text-methodist-blue">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">Ready to Join MYAF?</h2>
          <p className="text-xl text-warm-gray mb-8 max-w-2xl mx-auto">
            Whether you're new to our community or looking to deepen your faith journey, all young adults ages 18-35 are welcome in our fellowship.
          </p>
          <div className="flex justify-center">
            <Button
              className="bg-methodist-blue text-white hover:bg-opacity-90 px-8 py-3 text-lg font-semibold"
              onClick={() => scrollToSection("contact")}
            >
              Connect With Leaders
            </Button>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-300">
            <h3 className="text-lg font-semibold mb-4 text-methodist-blue">Questions? Contact Our Young Adult Leaders:</h3>
            <div className="space-y-2 text-warm-gray">
              <p>Young Adult Pastor: Rev. John B. Manalo</p>
              <p>MYAF Coordinator: [TBA]</p> 
              <p>Email: blessedmyaf01@gmail.com</p>
              <p>Facebook Page: Blessed MYAF</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Back to Top Button */}
      {showBackButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-methodist-blue text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 z-50 hover:scale-110"
          aria-label="Back to top"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
