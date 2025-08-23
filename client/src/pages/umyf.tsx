import { useEffect, useState } from "react";
import Header from "@/components/header";
import UMYFHeader from "@/components/UMYFheader";
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
import { Calendar, Clock, Users, Heart, BookOpen, Music, ArrowUp } from "lucide-react";

export default function UMYF() {
  const [showBackButton, setShowBackButton] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleScroll = () => setShowBackButton(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="font-sans bg-gray-50 min-h-screen flex flex-col">
      {/* UMYF-Specific Header */}
      <UMYFHeader />
      {/* Hero Section - Enhanced Planetshakers Style */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden" id="home">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-pulse"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(30, 64, 175, 0.8) 25%, rgba(147, 51, 234, 0.7) 50%, rgba(59, 130, 246, 0.8) 75%, rgba(0, 0, 0, 0.9) 100%), radial-gradient(ellipse at center, rgba(255, 255, 255, 0.15) 0%, transparent 70%), url('https://scontent.fmnl19-1.fna.fbcdn.net/v/t39.30808-6/481083794_122203831448219109_2198001000273705036_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=f727a1&_nc_eui2=AeFlNOnNaUP4F5xuUyAqK06uE9MB2hbs8vMT0wHaFuzy85hGv0VWRq80MNKmHHqbx4_12IlO2j1s0Ym8TUyEl3M8&_nc_ohc=xQ2V4i5YfIMQ7kNvwGRQg0a&_nc_oc=AdmLGEWqiNANdCWASfdztSJRwMP7KZhL-BUps8zJJ6-WfArEtVvMOz0Lm91blzrJmW8&_nc_zt=23&_nc_ht=scontent.fmnl19-1.fna&_nc_gid=7lnuJwP-6abI0sgN1lb4bA&oh=00_AfXOW6wm5sncvz2oAJgfeIngIr2f3Wc0f46xRn_lMbVN6w&oe=68ABB3D3')`,
          }}
        />
        {/* Planetshakers-style moving particles */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-600/20 animate-pulse" />
        <div className="relative z-10 text-center text-white max-w-6xl mx-auto px-4">
          {/* Planetshakers-style youth headline */}
          <div className="mb-8">
            <h3 className="font-heading text-lg md:text-xl font-medium tracking-wide text-warm-gold uppercase mb-4">
              Welcome to
            </h3>
            <h1 className="font-heading text-6xl md:text-8xl lg:text-9xl font-black mb-4 leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 drop-shadow-2xl">
              BLESSED
            </h1>
            <h2 className="font-heading text-2xl md:text-4xl lg:text-5xl font-black mb-8 leading-none tracking-tight text-white drop-shadow-lg">
              UNITED METHODIST YOUTH FELLOWSHIP
            </h2>
            <p className="text-3xl md:text-4xl lg:text-5xl font-heading font-light tracking-wide text-yellow-300 drop-shadow-lg animate-pulse">
              WHERE YOUNG HEARTS MEET GOD
            </p>
          </div>

          <p className="text-lg md:text-xl mb-12 font-light max-w-2xl mx-auto leading-relaxed opacity-90">
            Join our vibrant youth community where faith grows, friendships thrive, and lives are transformed through God's amazing love.
          </p>

          {/* Modern action buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button
              onClick={() => scrollToSection("activities")}
              className="bg-white text-methodist-blue px-10 py-5 rounded-full text-lg font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
              data-testid="button-join-fellowship"
            >
              <Users className="mr-3 h-6 w-6" />
              Join Our Fellowship
            </Button>

            <Button
              onClick={() => window.open("https://www.facebook.com/BlessedUMCYouth", "_blank")}
              variant="outline"
              className="border-3 border-warm-gold text-warm-gold bg-transparent px-10 py-5 rounded-full text-lg font-bold hover:bg-warm-gold hover:text-methodist-blue transition-all transform hover:scale-105"
              data-testid="button-visit-facebook"
            >
              <Heart className="mr-3 h-6 w-6" />
              Connect With Us
            </Button>
          </div>

          {/* Quick youth links */}
          <div className="mt-16 flex flex-wrap justify-center gap-6 text-sm font-medium">
            <button
              onClick={() => scrollToSection('gallery')}
              className="text-blue-200 hover:text-white transition-colors underline underline-offset-4"
            >
              Gallery
            </button>
            <button
              onClick={() => scrollToSection('activities')}
              className="text-blue-200 hover:text-white transition-colors underline underline-offset-4"
            >
              Youth Activities
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-blue-200 hover:text-white transition-colors underline underline-offset-4"
            >
              About UMYF
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
      {/* About Section - Enhanced */}
      <section id="about" className="py-24 bg-gradient-to-br from-white via-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Planetshakers-style section header */}
          <div className="text-center mb-16">
            <h3 className="font-heading text-sm font-bold tracking-wide text-methodist-blue uppercase mb-4">
              Youth Fellowship
            </h3>
            <h2 className="text-5xl lg:text-6xl font-heading font-black text-gray-900 mb-6 leading-tight tracking-tight">
              About BLESSED UMYF
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A dynamic community where young hearts discover God's purpose, build authentic relationships, and impact the world.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Enhanced Cards with Planetshakers styling */}
            <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-heading text-2xl font-black text-gray-900 mb-4 tracking-tight">Faith & Fellowship</h3>
                <p className="text-gray-600 leading-relaxed">
                  Deepening our relationship with God through powerful worship, Bible study, and authentic conversations about faith and life's biggest questions.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-heading text-2xl font-black text-gray-900 mb-4 tracking-tight">Community Impact</h3>
                <p className="text-gray-600 leading-relaxed">
                  Transforming our community through service projects, mission trips, and outreach programs that demonstrate God's love in action.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Music className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-heading text-2xl font-black text-gray-900 mb-4 tracking-tight">Fun & Friendship</h3>
                <p className="text-gray-600 leading-relaxed">
                  Building lifelong friendships through exciting events, retreats, games, and shared experiences that create unforgettable memories together.
                </p>
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
                    <h3 className="text-xl font-semibold text-methodist-blue mb-2">Sunday Youth Group</h3>
                    <p className="text-warm-gray mb-1">Every Sunday after worship service</p>
                    <p className="text-warm-gray">10:30 AM - 12:00 PM</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Clock className="w-6 h-6 text-warm-gold mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold text-methodist-blue mb-2">Care Group</h3>
                    <p className="text-warm-gray mb-1">TBA</p>
                    <p className="text-warm-gray"></p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <BookOpen className="w-6 h-6 text-warm-gold mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold text-methodist-blue mb-2">Monthly Service Projects</h3>
                    <p className="text-warm-gray mb-1">Community outreach and service</p>
                    <p className="text-warm-gray">Fourth Sunday of each month</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-heading font-bold text-methodist-blue mb-8">Upcoming Events</h2>
              <div className="space-y-4">
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-blue-800">TBA</CardTitle>
                    <CardDescription className="text-blue-600">Stay tuned for updates!</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-blue-700">More amazing events coming soon!</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="text-green-800">TBA</CardTitle>
                    <CardDescription className="text-green-600">Stay tuned for updates!</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-green-700">More amazing events coming soon!</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
                  <CardHeader>
                    <CardTitle className="text-purple-800">TBA</CardTitle>
                    <CardDescription className="text-purple-600">Stay tuned for updates!</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-purple-700">More amazing events coming soon!</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300">
                  <CardHeader>
                    <CardTitle className="text-orange-800">🎉 More Events Coming Soon!</CardTitle>
                    <CardDescription className="text-orange-600">Stay tuned for announcements</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-orange-700">We're planning exciting activities, service projects, and fellowship opportunities. Follow our Facebook page for updates!</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section - Planetshakers Style */}
      <section id="gallery" className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Planetshakers-style header */}
          <div className="text-center mb-16">
            <h3 className="font-heading text-sm font-bold tracking-wide text-blue-600 uppercase mb-4">
              Youth Fellowship
            </h3>
            <h2 className="text-5xl lg:text-6xl font-heading font-black text-gray-900 mb-6 leading-tight tracking-tight">
              UMYF Gallery
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Capturing moments of faith, friendship, and fellowship as we grow together in Christ.
            </p>
          </div>
          
          {/* Hero Featured Image */}
          <div className="mb-16">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1200&h=600&fit=crop" 
                alt="UMYF Youth Worship"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 via-transparent to-purple-600/80">
                <div className="absolute bottom-8 left-8 text-white">
                  <h3 className="font-heading text-3xl font-black mb-2">United in Faith</h3>
                  <p className="text-lg">Our youth fellowship growing stronger together</p>
                </div>
              </div>
            </div>
          </div>

          {/* Simplified Grid Layout - Planetshakers Style */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {/* Featured large image */}
            <div className="col-span-2 row-span-2 relative group rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
              <img 
                src="https://images.unsplash.com/photo-1540479859555-17af45c78602?w=600&h=600&fit=crop" 
                alt="Youth Service Project"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/20 transition-colors duration-300">
                <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h4 className="font-bold text-lg">Service Projects</h4>
                  <p className="text-sm">Making a difference together</p>
                </div>
              </div>
            </div>

            <div className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
              <img 
                src="https://images.unsplash.com/photo-1529390079861-591de354faf5?w=300&h=300&fit=crop" 
                alt="Youth Fellowship"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/20 transition-colors duration-300">
                <div className="absolute bottom-2 left-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-sm font-medium">Fellowship</p>
                </div>
              </div>
            </div>

            <div className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
              <img 
                src="https://images.unsplash.com/photo-1509909756405-be0199881695?w=300&h=300&fit=crop" 
                alt="Youth Worship"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/20 transition-colors duration-300">
                <div className="absolute bottom-2 left-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-sm font-medium">Worship</p>
                </div>
              </div>
            </div>

            <div className="col-span-2 relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
              <img 
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&h=300&fit=crop" 
                alt="Youth Prayer & Devotion"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/20 transition-colors duration-300">
                <div className="absolute bottom-3 left-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h4 className="font-bold">Prayer & Devotion</h4>
                  <p className="text-sm">Growing closer to God together</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Feature Section */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="relative group rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
              <img 
                src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=500&fit=crop" 
                alt="Sunday Youth Service"
                className="w-full h-64 md:h-80 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-600/70 to-transparent">
                <div className="absolute bottom-4 left-4 text-white">
                  <h4 className="font-bold text-lg mb-1">Sunday Fellowship</h4>
                  <p className="text-sm">Every Sunday after service</p>
                </div>
              </div>
            </div>

            <div className="relative group rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
              <img 
                src="https://images.unsplash.com/photo-1529390079861-591de354faf5?w=400&h=500&fit=crop" 
                alt="Youth Social Events"
                className="w-full h-64 md:h-80 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-600/70 to-transparent">
                <div className="absolute bottom-4 left-4 text-white">
                  <h4 className="font-bold text-lg mb-1">Social Events</h4>
                  <p className="text-sm">Building friendships that last</p>
                </div>
              </div>
            </div>

            <div className="relative group rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
              <img 
                src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400&h=500&fit=crop" 
                alt="Youth Spiritual Growth"
                className="w-full h-64 md:h-80 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-600/70 to-transparent">
                <div className="absolute bottom-4 left-4 text-white">
                  <h4 className="font-bold text-lg mb-1">Spiritual Growth</h4>
                  <p className="text-sm">Growing together in faith</p>
                </div>
              </div>
            </div>
          </div>

          {/* Extended Gallery - Always Visible */}
          <div className="mb-12">
            <h3 className="text-3xl font-heading font-black text-blue-800 mb-8 text-center tracking-tight">MORE UMYF MEMORIES</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <img 
                  src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=300&h=300&fit=crop" 
                  alt="Youth Game Night"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-3 left-3 text-white">
                    <p className="text-sm font-bold">GAME NIGHT</p>
                  </div>
                </div>
              </div>

              <div className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <img 
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop" 
                  alt="Youth Sports"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-3 left-3 text-white">
                    <p className="text-sm font-bold">SPORTS DAY</p>
                  </div>
                </div>
              </div>

              <div className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <img 
                  src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=300&h=300&fit=crop" 
                  alt="Youth Bible Study"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-3 left-3 text-white">
                    <p className="text-sm font-bold">BIBLE STUDY</p>
                  </div>
                </div>
              </div>

              <div className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <img 
                  src="https://images.unsplash.com/photo-1552581234-26160f608093?w=300&h=300&fit=crop" 
                  alt="Youth Outreach"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-3 left-3 text-white">
                    <p className="text-sm font-bold">OUTREACH</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="relative group rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <img 
                  src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=600&h=400&fit=crop" 
                  alt="Youth Conference"
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 text-white">
                    <h4 className="font-bold text-lg mb-1">YOUTH CONFERENCE</h4>
                    <p className="text-sm">Growing in wisdom and knowledge</p>
                  </div>
                </div>
              </div>

              <div className="relative group rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <img 
                  src="https://images.unsplash.com/photo-1519333471862-2c7496ba58a3?w=600&h=400&fit=crop" 
                  alt="Youth Mission Trip"
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 text-white">
                    <h4 className="font-bold text-lg mb-1">MISSION TRIPS</h4>
                    <p className="text-sm">Serving God's people worldwide</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Gallery CTA - Planetshakers Style */}
          <div className="text-center">
            <div className="bg-white rounded-3xl p-8 shadow-xl max-w-2xl mx-auto">
              <h3 className="font-heading text-2xl font-bold text-gray-900 mb-4">Join Our Youth Family!</h3>
              <p className="text-gray-600 mb-6">Experience the joy of growing in faith with friends who become family. Connect with us and be part of something amazing!</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => window.open("https://www.facebook.com/BlessedUMYF", "_blank")}
                  className="bg-blue-600 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  Follow Our Journey
                </Button>
                <Button
                  onClick={() => scrollToSection("contact")}
                  variant="outline"
                  className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-full font-bold hover:bg-blue-600 hover:text-white transition-all transform hover:scale-105"
                >
                  Get Connected
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-white text-methodist-blue">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">Ready to Join UMYF?</h2>
          <p className="text-xl text-warm-gray mb-8 max-w-2xl mx-auto">
            Whether you're new to faith or have been part of our church family for years, all youth ages 12-23 are welcome in our fellowship.
          </p>
          <div className="flex justify-center">
            <Button
              className="bg-methodist-blue text-white hover:bg-opacity-90 px-8 py-3 text-lg font-semibold"
              onClick={() => scrollToSection("contact")}
            >
              Contact Youth Leaders
            </Button>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-300">
            <h3 className="text-lg font-semibold mb-4 text-methodist-blue">Questions? Contact Our Youth Leaders:</h3>
            <div className="space-y-2 text-warm-gray">
              <p>Youth Pastor: Rev. John B. Manalo</p>
              <p>Youth Coordinator: Anika Loreen Lagarto</p>
              <p>Email: blessedumyf01@gmail.com</p>
              <p>Facebook Page: Blessed UMYF</p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
      {/* Floating Back to Top Button */}
      {showBackButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 rounded-full shadow-lg flex items-center justify-center z-50 bg-white text-methodist-blue opacity-60 hover:opacity-100 transition-opacity duration-300"
          title="Back to Top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}