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
                src="https://scontent.fmnl19-1.fna.fbcdn.net/v/t39.30808-6/480718233_1303290355132528_8002622457542559059_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeE9vpRBlhRUz1gk70p-oAgNQ68YGiXGxFdDrxgaJcbEVycKIYzP29U49zyESosd5tauSsrhbXFFKs_UpAT46uBZ&_nc_ohc=2HLgu1omD84Q7kNvwHAYCJN&_nc_oc=Adldu__vl2EicxKcktMmVhfB72g5C9mgf3ZcVk-Iat8L1hJeJr7YjWcsjTRwPfUjE58&_nc_zt=23&_nc_ht=scontent.fmnl19-1.fna&_nc_gid=JWYb31Y-Ameg1wlmm1rapw&oh=00_AfUJoWv0dhLsfSEYTMz-LtVnMKba3N7l20AprRte1vBzhQ&oe=68AFDAC3"
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
              <Link
                href="/umyf"
                className="flex items-center space-x-1 text-white hover:text-warm-gold transition"
              >
                <Users className="w-4 h-4" />
                <span>UMYF</span>
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
              <Link
                href="/umyf"
                className="flex items-center space-x-2 w-full text-left text-white hover:text-warm-gold transition"
              >
                <Users className="w-4 h-4" />
                <span>UMYF</span>
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

      {/* Hero Section - MYAF Orange/Red Theme */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden" id="home">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(255, 69, 0, 0.6) 0%, rgba(255, 140, 0, 0.5) 25%, rgba(255, 165, 0, 0.4) 50%, rgba(220, 20, 60, 0.5) 75%, rgba(255, 69, 0, 0.6) 100%), url('https://scontent.fmnl19-1.fna.fbcdn.net/v/t39.30808-6/484078347_122111038202770547_2119252781533538610_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=cc71e4&_nc_eui2=AeHsoEPhJLlyfUgk9YK9XiP8IRJcyE6o6QUhElzITqjpBQAXKgpQy4fLElr-P39haq1SgRNczLnt8BrLi5K0bB29&_nc_ohc=j7s4pDASEe4Q7kNvwHQIrI2&_nc_oc=Adk4TDQ_T5e3X4QtjnQM-E_4CAzTztPpNj5FTGIOJ9S12kKJM4PPWGCwtNoW0xeMRSE&_nc_zt=23&_nc_ht=scontent.fmnl19-1.fna&_nc_gid=qCryPvHJ6HXSmrVyBd4OWw&oh=00_AfUb7eQoW7QAG1jRtMEtUvB3JFLdQkFp1R_Kh-A6UHcrBw&oe=68AFE76A')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-orange-900/50 via-orange-800/30 to-red-900/60" />
        <div className="relative z-10 text-center text-white max-w-6xl mx-auto px-4">
          <div className="mb-8">
            <h3 className="font-heading text-lg md:text-xl font-medium tracking-wide text-orange-200 uppercase mb-4">
              Welcome to
            </h3>
            <h1 className="font-heading text-6xl md:text-8xl lg:text-9xl font-black mb-6 leading-none tracking-tighter drop-shadow-2xl">
              BLESSED
            </h1>
            <h2 className="font-heading text-2xl md:text-4xl lg:text-5xl font-bold mb-8 leading-tight tracking-wide">
              Methodist Young Adult Fellowship
            </h2>
            <p className="text-3xl md:text-4xl lg:text-5xl font-heading font-light tracking-wide text-orange-200">
              GROWING TOGETHER IN FAITH
            </p>
          </div>

          <p className="text-lg md:text-xl mb-12 font-light max-w-2xl mx-auto leading-relaxed opacity-90">
            A vibrant community for young adults (24-40) seeking to deepen their faith, build meaningful relationships, and make a difference in the world.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button
              onClick={() => scrollToSection("activities")}
              className="bg-white text-orange-600 px-10 py-5 rounded-full text-lg font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
            >
              <Users className="mr-3 h-6 w-6" />
              Join Our Community
            </Button>

            <Button
              onClick={() => window.open("https://www.facebook.com/profile.php?id=61573116435144", "_blank")}
              variant="outline"
              className="border-3 border-warm-gold text-warm-gold bg-transparent px-10 py-5 rounded-full text-lg font-bold hover:bg-warm-gold hover:text-orange-600 transition-all transform hover:scale-105"
            >
              <Heart className="mr-3 h-6 w-6" />
              Connect With Us
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-gradient-to-br from-white via-orange-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="font-heading text-sm font-bold tracking-wide text-orange-600 uppercase mb-4">
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
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
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
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
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
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
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

      {/* Gallery Section - Same Format as UMYF */}
      <section id="gallery" className="py-20 bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="font-heading text-sm font-bold tracking-wide text-orange-600 uppercase mb-4">
              Our Community
            </h3>
            <h2 className="text-5xl lg:text-6xl font-heading font-black text-gray-900 mb-6 leading-tight tracking-tight">
              MYAF Gallery
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Witness our journey of faith, friendship, and service through these inspiring moments
            </p>
          </div>

          {/* Main Featured Image */}
          <div className="mb-16">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://scontent.fmnl19-1.fna.fbcdn.net/v/t39.30808-6/491841547_122121212102770547_5284709619941976712_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=f727a1&_nc_eui2=AeGwZ1xZy7EIVSw8qZpzadWnqvoDNbFDmzCq-gM1sUObMNG69lLwZxhxXF4ICYCTBrU1h4QxJMQWXX5eGVbEMl_K&_nc_ohc=P9mJ4TRPVT8Q7kNvwFukHxn&_nc_oc=AdkvvMXWdi6lPBHMvnOIp-YU4WkuOkj6HTxVvuSvFGKooks9v1BBgZWh3qxsm99UdDc&_nc_zt=23&_nc_ht=scontent.fmnl19-1.fna&_nc_gid=t4ExlSAnlPA53dM8gAy3Qg&oh=00_AfU9IQiUofogSrVOK4Bskp6WP17HysZQPWo9i6fA2iaSiw&oe=68AFEDD7"
                alt="MYAF Group Photo"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600/80 via-transparent to-red-600/80">
                <div className="absolute bottom-8 left-8 text-white">
                  <h3 className="font-heading text-3xl font-black mb-2">United in Faith</h3>
                  <p className="text-lg">Our MYAF family growing stronger together</p>
                </div>
              </div>
            </div>
          </div>

          {/* Gallery Grid - Same Layout as UMYF */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
            <div className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
              <img
                src="https://scontent.fmnl19-1.fna.fbcdn.net/v/t39.30808-6/505242845_122131173500770547_8243722433938806168_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=f727a1&_nc_eui2=AeGZE7EInN4dUlnBY43suH_Z5sy738qR3jvmzLvfypHeO5mx_TVJyUvnUbYPROU_TttsBK4sFSpqoQ11Zagqg3kc&_nc_ohc=wY0sjwsOxYEQ7kNvwHiQKwJ&_nc_oc=AdmgQAltbL5lWJEjI0CcbAFwUPd79ZphslPmcnSJ3A1TKzYHZ9WSiVLlflAY2QCPs3g&_nc_zt=23&_nc_ht=scontent.fmnl19-1.fna&_nc_gid=m0OMmlrf7bgJxaBIzqGo0g&oh=00_AfXV6TAlatTx3MDF0hZmoXDBnP58piZbI2L5cx-ht9_dWQ&oe=68B000ED"
                alt="Community Service Project"
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-orange-600/60 to-transparent">
                <div className="absolute bottom-4 left-4 text-white">
                  <h4 className="font-bold text-sm">Outreach Projects</h4>
                </div>
              </div>
            </div>

            <div className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
              <img
                src="https://scontent.fmnl19-1.fna.fbcdn.net/v/t39.30808-6/482067794_122111086790770547_7409733067654306052_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=102&ccb=1-7&_nc_sid=f727a1&_nc_eui2=AeH4obnZMUykvCxyXWB6hatQvVICC6XIDaW9UgILpcgNpdBy2bT3H2czVN1UV7nKDtmQQFhn1-cBVgMSdWDvwjBo&_nc_ohc=ElB9zY5LRqoQ7kNvwFurS5b&_nc_oc=AdmgVqELF_sdtPteQvoQGLc2fCT4OKY-bMIiwo8aLNyCQuxa8HYj0m6wY6-GxDWquZc&_nc_zt=23&_nc_ht=scontent.fmnl19-1.fna&_nc_gid=jPohfl50GxTbp6izSq1P1g&oh=00_AfU5h4GJfpaQTG1NnpvgdmtSo0XkOIO-s7SLxT4itWkKdA&oe=68AFE9B2"
                alt="Fellowship Dinner"
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-red-600/60 to-transparent">
                <div className="absolute bottom-4 left-4 text-white">
                  <h4 className="font-bold text-sm">Fellowship Dinners</h4>
                </div>
              </div>
            </div>

            <div className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
              <img
                src="https://scontent.fmnl19-1.fna.fbcdn.net/v/t39.30808-6/497698537_1386859380108958_4363844762276679815_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=f727a1&_nc_eui2=AeGEUHVsoYfvMbPqNAMhteexvnnR6PwMvsa-edHo_Ay-xnQeTfsevO83HALcJEjkmSqIs-lk5Z9_A6su19OHNMnz&_nc_ohc=sFj1WuvEzDIQ7kNvwFeiytk&_nc_oc=AdmY0QLfNv0iTXt4L8FqmBp3Ot5MA4fGK3Oe39ZX6cEh9BimWdQQqKKaDo9nR9_AdnQ&_nc_zt=23&_nc_ht=scontent.fmnl19-1.fna&_nc_gid=fsq_fQqU2WMRqUX3uqmYGQ&oh=00_AfVL8tV_VKxR58yxmrTBxEKn1MvFTPCl21iNAuR3yZB-vA&oe=68AFF5D7"
                alt="Worship Night"
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-orange-600/60 to-transparent">
                <div className="absolute bottom-4 left-4 text-white">
                  <h4 className="font-bold text-sm">Worship Nights</h4>
                </div>
              </div>
            </div>

            <div className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
              <img
                src="https://scontent.fmnl19-1.fna.fbcdn.net/v/t39.30808-6/500122079_1398108128984083_4079370421041972219_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=f727a1&_nc_eui2=AeHZfbhmBDCSdKOKxuTZ9aDubo8ZNwKxes5ujxk3ArF6zgJUQ5aM4unR7rXZvysA0URLez9PSVBLQceo55xWKDVq&_nc_ohc=a8teyYRItsAQ7kNvwGDCmTM&_nc_oc=AdkgvJiugaHPKQXXIzyPkgKyF2H2JHHQZO5nFPJgdysmstumFDpAarn91kg_725UEpo&_nc_zt=23&_nc_ht=scontent.fmnl19-1.fna&_nc_gid=MSRnzcmVd2iHlv4P9aHoIw&oh=00_AfUWiPVx7t858tTgvp3gKhOn1FE82ZbRcDVvyYvGLybZgQ&oe=68AFE8D3"
                alt="Annual Retreat"
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-red-600/60 to-transparent">
                <div className="absolute bottom-4 left-4 text-white">
                  <h4 className="font-bold text-sm">National UMYAF Event</h4>
                </div>
              </div>
            </div>

            <div className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
              <img
                src="https://scontent.fmnl19-1.fna.fbcdn.net/v/t39.30808-6/506456203_122132088422770547_7715905960937486971_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=f727a1&_nc_eui2=AeFGq-icI6HqXsNPagSymb0halxMynUcN9VqXEzKdRw31Xf4i_fLI34SjA1rnBOZquFcLghUyIOQI36JNfbMfz-T&_nc_ohc=V7HnAdZ9ghQQ7kNvwGVTNzO&_nc_oc=AdkAlTIvlV77ggBtQb9yT5biZqpOYVZFO5PyBVXtKSKLPDmrWaENq8W7ONEhlaRtUoc&_nc_zt=23&_nc_ht=scontent.fmnl19-1.fna&_nc_gid=8BWst1KQSX8RblJKhfTCfw&oh=00_AfWnPd_fsaK43ltsSV0uwrYzqi-t3_KYjg4fSlakjafPBQ&oe=68AFEEC8"
                alt="Game Night"
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-yellow-600/60 to-transparent">
                <div className="absolute bottom-4 left-4 text-white">
                  <h4 className="font-bold text-sm">Game Nights</h4>
                </div>
              </div>
            </div>

            <div className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
              <img
                src="https://scontent.fmnl19-1.fna.fbcdn.net/v/t39.30808-6/482250777_122111069024770547_6595456328234096304_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=f727a1&_nc_eui2=AeHMddofZa4aNcZj_BcXDw5vGVB2k_TDeeAZUHaT9MN54BkEGWXjueDAYZoL24lPXQQgSBEI3Q_XRqhddCdyMCya&_nc_ohc=084_DLgwpzoQ7kNvwEONuaL&_nc_oc=AdnFMA0JThpWSVA_oCgHpioi3_Z2o36NpvE_CDoFSMgwuecMdXsoMKxilkXIr0GZ-Gw&_nc_zt=23&_nc_ht=scontent.fmnl19-1.fna&_nc_gid=z0zWWHDxvxWFktwtJDj2Zg&oh=00_AfVcsNvZH__D9q3mTOs_pT8BoQE-zWAoVU9RGtLp8CWgqw&oe=68B00B62"
                alt="Mission Trip"
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-orange-700/60 to-transparent">
                <div className="absolute bottom-4 left-4 text-white">
                  <h4 className="font-bold text-sm">Mission Trips</h4>
                </div>
              </div>
            </div>

            <div className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
              <img
                src="https://scontent.fmnl19-1.fna.fbcdn.net/v/t39.30808-6/482046134_122111062580770547_5012625195662619704_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=f727a1&_nc_eui2=AeHumrqBAtgiunwBRgar1JRftzXp_-47odC3Nen_7juh0H8I2W4_S2WTk5Mx5LM2eqJ1ZRlZCWsaZhpGAuNFSuy3&_nc_ohc=7ChrISDOyRQQ7kNvwEasOpS&_nc_oc=Adk9tOF2yh5mKwRG1wtKeByTKjCp6EvL4R1ikBIlxo5RcYLHEYON3KhOX3A-W4MjFYk&_nc_zt=23&_nc_ht=scontent.fmnl19-1.fna&_nc_gid=aQy2hwrx9D_bb8a6duMFwQ&oh=00_AfXSowNlB8m6VasVIwmUDAcbf8FdIsj0Dpq4pu_w_upEVA&oe=68AFFC62"
                alt="Conference"
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-red-700/60 to-transparent">
                <div className="absolute bottom-4 left-4 text-white">
                  <h4 className="font-bold text-sm">Conferences</h4>
                </div>
              </div>
            </div>

            <div className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
              <img
                src="https://scontent.fmnl19-1.fna.fbcdn.net/v/t39.30808-6/494635176_673621848748904_73196020993970412_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=f727a1&_nc_eui2=AeHY5itZRC-ZdaoLOFfVtoOT3LgRMHQW4ZzcuBEwdBbhnE-NoHjC3k50a6C2DB4wRwJzUZe5dm6hQGbbmGVu9M-6&_nc_ohc=ephTJPX3X8gQ7kNvwEj6cRE&_nc_oc=AdlQ8Xlt3K4WKyhaoSo7NhZTayGqn43z54mnmcrOx4Kf8w_-XVOsm6MtmVzMF26q7k0&_nc_zt=23&_nc_ht=scontent.fmnl19-1.fna&_nc_gid=HQr3eacKsAi3aoYVrdPotg&oh=00_AfWZ2qb6Gicqcnk9Y4mH0LLQZNxSwns9ZPeYo7BL62ZsYg&oe=68AFDFFA"
                alt="Community Outreach"
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-orange-600/60 to-transparent">
                <div className="absolute bottom-4 left-4 text-white">
                  <h4 className="font-bold text-sm">Community Outreach</h4>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Row - Same as UMYF */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="relative group rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
              <img
                src="https://scontent.fmnl19-1.fna.fbcdn.net/v/t39.30808-6/484095799_122111074382770547_1715425946853434866_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=f727a1&_nc_eui2=AeFi3PQu84s5GnLxw8dHZRX_d9v-1TNkr2t32_7VM2Sva1HRn_zsfS1i_3q7ty1eLEqD25kuU-0XDdiEYlgVhY12&_nc_ohc=D-jqC9t15-AQ7kNvwHd_ZLh&_nc_oc=AdmWevDwMxqIBIH-jxjYTVjrOtPSfLoYJFb3UNks5dQHgblj4Otm9O9WcpG1oabF1p4&_nc_zt=23&_nc_ht=scontent.fmnl19-1.fna&_nc_gid=Cojr8shLguD9-qVjFBQ5lw&oh=00_AfWDmtafgBRB_lnXyGBrtPgpHJDfw-G82JxAgDMNJV59Tw&oe=68B013C0"
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
                src="https://scontent.fmnl19-1.fna.fbcdn.net/v/t39.30808-6/522138233_122138426186770547_7296594761298403719_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=f727a1&_nc_eui2=AeEaHVAYA9YkM9alOducQZaAPmZQR4iN9js-ZlBHiI32O4y8oRLZ4k07w5A50KP5zKUoj2pL0Ycm8IXSViQqT43H&_nc_ohc=6viLzeBXUMoQ7kNvwFnvllY&_nc_oc=AdkErR_fKhrzE0LyaqaXEBvi2g_BaRccWLgIvSOnOegDXGM1CPf4WXVhtwJJND5FLUo&_nc_zt=23&_nc_ht=scontent.fmnl19-1.fna&_nc_gid=K0_fjFoBcvee3LOnO6AQTw&oh=00_AfWCLAQ0hFHTUWpxtZvaIoqLG91ODZsSQFxrvPJ9j7djyA&oe=68AFE86F"
                alt="Social Events"
                className="w-full h-64 md:h-80 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-red-600/60 to-transparent">
                <div className="absolute bottom-4 left-4 text-white">
                  <h4 className="font-bold text-lg mb-1">Fellowships</h4>
                  <p className="text-sm">Building friendships that last</p>
                </div>
              </div>
            </div>

            <div className="relative group rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
              <img
                src="https://scontent.fmnl19-1.fna.fbcdn.net/v/t39.30808-6/487279785_122116574048770547_8677942940065996325_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=f727a1&_nc_eui2=AeH-2gTPkPsTTmXhD3nAm1gtN1hlHxzCyL03WGUfHMLIvXn0i16tN2cotM9g05zxKJ0BVyf81O4IQjWdNDkiQYGO&_nc_ohc=T4etp9Ip0V0Q7kNvwFEmu3I&_nc_oc=AdndIdMFIYRJYXjPCAF-oQ62VOTTqSVRQfwgOE0EmP15Hw8BvdyNbGQeDSl_u6IiMec&_nc_zt=23&_nc_ht=scontent.fmnl19-1.fna&_nc_gid=rc9bhvK7Fci7MB75BF2M8Q&oh=00_AfUYNt8m40KrhO8hlF8Dak05PGbd0_AMPUdpfxzzzNRvfw&oe=68AFE460"
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

          {/* Gallery CTA */}
          <div className="text-center">
            <div className="bg-white rounded-3xl p-8 shadow-xl max-w-2xl mx-auto">
              <h3 className="font-heading text-2xl font-bold text-gray-900 mb-4">Want to Join Our Community?</h3>
              <p className="text-gray-600 mb-6">Follow us on social media to see more of our adventures and stay connected with our MYAF family!</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => window.open("https://www.facebook.com/profile.php?id=61573116435144", "_blank")}
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
              <h2 className="text-3xl font-heading font-bold text-orange-600 mb-8">
                When We Meet
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Calendar className="w-6 h-6 text-red-600 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold text-orange-600 mb-2">Sunday Young Adult Group</h3>
                    <p className="text-gray-600 mb-1">Every Sunday after worship service</p>
                    <p className="text-gray-600">12:00 PM - 1:30 PM</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Clock className="w-6 h-6 text-red-600 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold text-orange-600 mb-2">Weekly Bible Study</h3>
                    <p className="text-gray-600 mb-1">Thursday Evenings </p>
                    <p className="text-gray-600">7:00 PM - 9:00 PM</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <BookOpen className="w-6 h-6 text-red-600 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold text-orange-600 mb-2">Monthly Service Projects</h3>
                    <p className="text-gray-600 mb-1">Community outreach and service</p>
                    <p className="text-gray-600">Third Sunday of each month</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-heading font-bold text-orange-600 mb-8">Upcoming Events</h2>
              <div className="space-y-4">
                <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
                  <CardHeader>
                    <CardTitle className="text-orange-800">TBA</CardTitle>
                    <CardDescription className="text-orange-600">Stay tuned for updates!</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-orange-700">More amazing events coming soon!</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
                  <CardHeader>
                    <CardTitle className="text-red-800">TBA</CardTitle>
                    <CardDescription className="text-red-600">Stay tuned for updates!</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-red-700">More amazing events coming soon!</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
                  <CardHeader>
                    <CardTitle className="text-yellow-800">TBA</CardTitle>
                    <CardDescription className="text-yellow-600">Stay tuned for updates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-yellow-700">More amazing events coming soon!</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-white text-orange-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">Ready to Join MYAF?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Whether you're new to our community or looking to deepen your faith journey, all young adults ages 24-40 are welcome in our fellowship.
          </p>
          <div className="flex justify-center">
            <Button
              className="bg-orange-600 text-white hover:bg-orange-700 px-8 py-3 text-lg font-semibold"
              onClick={() => scrollToSection("contact")}
            >
              Connect With Leaders
            </Button>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-300">
            <h3 className="text-lg font-semibold mb-4 text-orange-600">Questions? Contact Our Young Adult Leaders:</h3>
            <div className="space-y-2 text-gray-600">
              <p>Young Adult Pastor: Rev. John B. Manalo</p>
              <p>MYAF Coordinator: Juliet Condes Dapitan</p>
              <p></p>
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
          className="fixed bottom-8 right-8 bg-orange-600 text-white p-3 rounded-full shadow-lg hover:bg-orange-700 transition-all duration-300 z-50 hover:scale-110"
          aria-label="Back to top"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}