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
      {/* Hero Section - Planetshakers Style */}
      <section className="relative h-screen flex items-center justify-center" id="home">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(27, 54, 93, 0.8) 0%, rgba(60, 30, 120, 0.6) 25%, rgba(0, 0, 0, 0.7) 50%, rgba(34, 139, 34, 0.5) 75%, rgba(27, 54, 93, 0.8) 100%), radial-gradient(ellipse at center, rgba(255, 255, 255, 0.1) 0%, transparent 70%), url('https://scontent.fmnl19-1.fna.fbcdn.net/v/t39.30808-6/481083794_122203831448219109_2198001000273705036_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=f727a1&_nc_eui2=AeFlNOnNaUP4F5xuUyAqK06uE9MB2hbs8vMT0wHaFuzy85hGv0VWRq80MNKmHHqbx4_12IlO2j1s0Ym8TUyEl3M8&_nc_ohc=xQ2V4i5YfIMQ7kNvwGRQg0a&_nc_oc=AdmLGEWqiNANdCWASfdztSJRwMP7KZhL-BUps8zJJ6-WfArEtVvMOz0Lm91blzrJmW8&_nc_zt=23&_nc_ht=scontent.fmnl19-1.fna&_nc_gid=7lnuJwP-6abI0sgN1lb4bA&oh=00_AfXOW6wm5sncvz2oAJgfeIngIr2f3Wc0f46xRn_lMbVN6w&oe=68ABB3D3')`,
          }}
        />
        <div className="relative z-10 text-center text-white max-w-6xl mx-auto px-4">
          {/* Planetshakers-style youth headline */}
          <div className="mb-8">
            <h3 className="font-heading text-lg md:text-xl font-medium tracking-wide text-warm-gold uppercase mb-4">
              United Methodist Youth Fellowship
            </h3>
            <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-none tracking-tight">
              BLESSED UMYF
            </h1>
            <p className="text-2xl md:text-3xl lg:text-4xl font-heading font-light tracking-wide text-blue-100">
              Where Young Hearts Meet God
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
                    <h3 className="text-xl font-semibold text-methodist-blue mb-2">Wednesday Bible Study</h3>
                    <p className="text-warm-gray mb-1">Mid-week fellowship and study</p>
                    <p className="text-warm-gray">7:00 PM - 8:30 PM</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <BookOpen className="w-6 h-6 text-warm-gold mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold text-methodist-blue mb-2">Monthly Service Projects</h3>
                    <p className="text-warm-gray mb-1">Community outreach and service</p>
                    <p className="text-warm-gray">Fourth Saturday of each month</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-heading font-bold text-methodist-blue mb-8">Upcoming Events</h2>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Youth Winter Retreat</CardTitle>
                    <CardDescription>February 14-16, 2025</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-warm-gray">Join us for a weekend of faith, fun, and fellowship at Camp Marymount.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Community Food Drive</CardTitle>
                    <CardDescription>March 1-8, 2025</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-warm-gray">Help us collect food donations for local families in need.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Youth Sunday Leadership</CardTitle>
                    <CardDescription>March 15, 2025</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-warm-gray">Our youth will lead worship service, sharing their faith with the congregation.</p>
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