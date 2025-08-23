import { useEffect, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Heart, Users, BookOpen, Handshake, CheckCircle, Star, ArrowUp, MapPin, Clock, Phone, Mail } from "lucide-react";
import { Link } from "wouter";

export default function AboutPage() {
  const [showBackButton, setShowBackButton] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleScroll = () => setShowBackButton(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="font-sans bg-gray-50 min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-methodist-blue via-blue-700 to-blue-900 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="font-heading text-lg font-bold tracking-wide text-warm-gold uppercase mb-4">
            About Blessed UMC
          </h3>
          <h1 className="text-5xl lg:text-7xl font-heading font-black mb-6 leading-tight tracking-tight">
            Our Story & Mission
          </h1>
          <p className="text-xl lg:text-2xl max-w-4xl mx-auto opacity-90">
            Building God's kingdom through authentic community, powerful worship, and radical love since 1994.
          </p>
        </div>
      </section>

      {/* Main Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="bg-gray-50 rounded-3xl p-10 shadow-xl border border-gray-200">
                <h2 className="font-heading text-3xl font-black text-gray-900 mb-6">
                  30+ Years of Faith & Service
                </h2>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  Since 1994, Blessed United Methodist Church has been transforming lives and strengthening our community through the power of God's love. We've grown from humble beginnings into a thriving church family committed to authentic worship and radical service.
                </p>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Our mission is clear: <span className="font-semibold text-methodist-blue">to make disciples of Jesus Christ for the transformation of the world.</span> We believe in open hearts, open minds, and open doors - creating space where everyone can encounter God's amazing grace.
                </p>

                {/* Core Values */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center space-x-3 p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors">
                    <div className="w-12 h-12 bg-methodist-blue rounded-full flex items-center justify-center shadow-lg">
                      <Heart className="text-white w-6 h-6" />
                    </div>
                    <span className="font-semibold text-gray-800">
                      Compassionate Care
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 p-4 rounded-xl bg-yellow-50 hover:bg-yellow-100 transition-colors">
                    <div className="w-12 h-12 bg-warm-gold rounded-full flex items-center justify-center shadow-lg">
                      <Handshake className="text-white w-6 h-6" />
                    </div>
                    <span className="font-semibold text-gray-800">
                      Community Service
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-colors">
                    <div className="w-12 h-12 bg-soft-green rounded-full flex items-center justify-center shadow-lg">
                      <BookOpen className="text-white w-6 h-6" />
                    </div>
                    <span className="font-semibold text-gray-800">
                      Biblical Teaching
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors">
                    <div className="w-12 h-12 bg-methodist-blue rounded-full flex items-center justify-center shadow-lg">
                      <Users className="text-white w-6 h-6" />
                    </div>
                    <span className="font-semibold text-gray-800">
                      Inclusive Fellowship
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Grid */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6">
                <img
                  src="https://scontent.fmnl19-1.fna.fbcdn.net/v/t39.30808-6/480823083_122203830032219109_7273106123492049540_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=f727a1&_nc_eui2=AeE5ke5wGYGnKRGjmNaFURjUYLo6q3-dY51gujqrf51jnd7C9oQIcGHdExMjGnEOBBcLgrtc5Nc2P75K2961dq6h&_nc_ohc=uTOq47RxpBEQ7kNvwGdgfZJ&_nc_oc=AdnRTTXswsFLzq7XgJNR3bD7ZXpodye66mfEz3N0qY5OrOCCTjq1XZj17ZPxszZbgJM&_nc_zt=23&_nc_ht=scontent.fmnl19-1.fna&_nc_gid=H0fW5bv0zx3NWNRLS1wO_w&oh=00_AfX7gzy4n0BHNa3m4SCZlE0FhC2AScCYm-KIko_3aPr0hg&oe=68ABA735"
                  alt="Diverse congregation in worship"
                  className="rounded-2xl shadow-xl w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                />
                
                {/* Stats Card */}
                <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <Star className="w-6 h-6 text-warm-gold" />
                    <span className="text-2xl font-black text-methodist-blue">30+</span>
                  </div>
                  <p className="text-gray-600 font-medium">Years of faithful service to our community</p>
                </div>
              </div>
              
              <div className="space-y-6 pt-8">
                <img
                  src="https://scontent.fmnl19-1.fna.fbcdn.net/v/t39.30808-6/481103334_122203825064219109_8322692855473669829_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=f727a1&_nc_eui2=AeGg5b9fTN3ra2MpiJJCgTwIOXNDwft-Chc5c0PB-34KF2EEfVwIK3ax3rLXCT7L85YHcbv3x5JXh2ywDGq2oKUY&_nc_ohc=i996r0uHIycQ7kNvwFLvpTn&_nc_oc=AdldXXfImAkOC2sZksC8RC44w0HGLCXnVV0ycp_mvTHy-FVrt52PWhQesJj_9m-3Uj0&_nc_zt=23&_nc_ht=scontent.fmnl19-1.fna&_nc_gid=J3fvsW0S_-Fgx8NOsYShJQ&oh=00_AfW8K9JOcNhDxXGsNwNVgVCvP0cJ_f8qYG_rIjc3tTX4uA&oe=68AD0F41"
                  alt="Church community serving together"
                  className="rounded-2xl shadow-xl w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                />

                {/* Mission Statement Card */}
                <div className="bg-methodist-blue rounded-2xl p-6 shadow-xl text-white">
                  <CheckCircle className="w-6 h-6 text-warm-gold mb-3" />
                  <p className="font-bold text-lg leading-tight">
                    "Open hearts, open minds, open doors"
                  </p>
                  <p className="text-blue-100 text-sm mt-2">Our Methodist motto</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our History Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-heading font-black text-gray-900 mb-6">
              Our Journey Through Time
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From humble beginnings to a thriving community of faith and service.
            </p>
          </div>

          <div className="space-y-12">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-4 h-4 bg-methodist-blue rounded-full mr-4"></div>
                <span className="text-2xl font-bold text-methodist-blue">1994</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Church Founded</h3>
              <p className="text-gray-600 leading-relaxed">
                Blessed United Methodist Church was established with a vision to serve the community through faith, hope, and love. Our founding members laid the foundation for what would become a beacon of hope in our neighborhood.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-4 h-4 bg-warm-gold rounded-full mr-4"></div>
                <span className="text-2xl font-bold text-warm-gold">2000s</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Growing Community</h3>
              <p className="text-gray-600 leading-relaxed">
                As our congregation grew, we expanded our ministries to include youth programs, community outreach, and various fellowship groups. The UMYF and MYAF were established during this period, creating lasting bonds among our young adults.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-4 h-4 bg-soft-green rounded-full mr-4"></div>
                <span className="text-2xl font-bold text-soft-green">Today</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Thriving Ministry</h3>
              <p className="text-gray-600 leading-relaxed">
                Today, Blessed UMC continues to grow and serve, with active ministries serving all ages, regular community outreach programs, and a commitment to making disciples of Jesus Christ for the transformation of the world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-heading font-black text-gray-900 mb-6">
              Our Leadership
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Dedicated servants leading our church family with wisdom, compassion, and faith.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-3xl p-8 text-center shadow-xl border border-gray-100">
              <div className="w-24 h-24 bg-methodist-blue rounded-full mx-auto mb-6 flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Pastor</h3>
              <p className="text-gray-600 leading-relaxed">
                Providing spiritual guidance and leadership for our congregation with wisdom and compassion.
              </p>
            </div>

            <div className="bg-gray-50 rounded-3xl p-8 text-center shadow-xl border border-gray-100">
              <div className="w-24 h-24 bg-warm-gold rounded-full mx-auto mb-6 flex items-center justify-center">
                <Users className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Leadership Team</h3>
              <p className="text-gray-600 leading-relaxed">
                Dedicated volunteers who help coordinate ministries and support the life of our church community.
              </p>
            </div>

            <div className="bg-gray-50 rounded-3xl p-8 text-center shadow-xl border border-gray-100">
              <div className="w-24 h-24 bg-soft-green rounded-full mx-auto mb-6 flex items-center justify-center">
                <Heart className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Ministry Leaders</h3>
              <p className="text-gray-600 leading-relaxed">
                Passionate individuals leading our various ministries and outreach programs throughout the community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-gradient-to-br from-methodist-blue to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-black mb-6">Visit Us</h2>
            <p className="text-xl opacity-90">We'd love to welcome you to our church family!</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-lg mb-2">Address</h3>
              <p className="opacity-90">123 Church Street<br />Your City, State 12345</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-lg mb-2">Service Times</h3>
              <p className="opacity-90">Sunday: 9:00 AM<br />Wednesday: 7:00 PM</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-lg mb-2">Phone</h3>
              <p className="opacity-90">(555) 123-4567</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-lg mb-2">Email</h3>
              <p className="opacity-90">info@blessedumc.org</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/">
              <Button className="bg-white text-methodist-blue px-8 py-4 rounded-full text-lg font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg">
                Return Home
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      {/* Back to Top Button */}
      {showBackButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-methodist-blue text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-50"
          aria-label="Back to top"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}