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

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-methodist-blue via-blue-600 to-blue-800 text-white pt-20 pb-20" id="home">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(27, 54, 93, 0.8) 0%, rgba(60, 30, 120, 0.7) 25%, rgba(0, 0, 0, 0.6) 50%, rgba(34, 139, 34, 0.5) 75%, rgba(27, 54, 93, 0.8) 100%), url('https://scontent.fmnl19-1.fna.fbcdn.net/v/t39.30808-6/481083794_122203831448219109_2198001000273705036_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=f727a1&_nc_eui2=AeFlNOnNaUP4F5xuUyAqK06uE9MB2hbs8vMT0wHaFuzy85hGv0VWRq80MNKmHHqbx4_12IlO2j1s0Ym8TUyEl3M8&_nc_ohc=xQ2V4i5YfIMQ7kNvwGRQg0a&_nc_oc=AdmLGEWqiNANdCWASfdztSJRwMP7KZhL-BUps8zJJ6-WfArEtVvMOz0Lm91blzrJmW8&_nc_zt=23&_nc_ht=scontent.fmnl19-1.fna&_nc_gid=7lnuJwP-6abI0sgN1lb4bA&oh=00_AfXOW6wm5sncvz2oAJgfeIngIr2f3Wc0f46xRn_lMbVN6w&oe=68ABB3D3')`,
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">UMYF</h1>
          <h2 className="text-2xl md:text-3xl font-heading font-medium mb-4">
            United Methodist Youth Fellowship
          </h2>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Where young hearts connect with God and each other in faith, friendship, and service
          </p>
          <Button
            onClick={() => scrollToSection("activities")}
            className="bg-warm-gold text-methodist-blue hover:bg-opacity-90 px-8 py-3 text-lg font-semibold"
          >
            Join Our Fellowship
          </Button>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-methodist-blue mb-4">
              About Our Youth Fellowship
            </h2>
            <p className="text-lg text-warm-gray max-w-3xl mx-auto leading-relaxed">
              UMYF at Blessed UMC is a vibrant community where young people ages 12-18 come together
              to grow in faith, build lasting friendships, and make a positive impact in our community.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Heart className="w-12 h-12 text-warm-gold mx-auto mb-4" />
                <CardTitle>Faith & Fellowship</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Deepening our relationship with God through prayer, Bible study, and meaningful discussions about faith and life.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Users className="w-12 h-12 text-warm-gold mx-auto mb-4" />
                <CardTitle>Community Service</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Making a difference through local service projects, mission trips, and outreach programs that help those in need.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Music className="w-12 h-12 text-warm-gold mx-auto mb-4" />
                <CardTitle>Fun & Friendship</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Building lasting friendships through games, retreats, social events, and shared experiences that create memories for life.
                </CardDescription>
              </CardContent>
            </Card>
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
                    <p className="text-warm-gray">First Saturday of each month</p>
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
            Whether you're new to faith or have been part of our church family for years, all youth ages 12-18 are welcome in our fellowship.
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Button
              className="bg-methodist-blue text-white hover:bg-opacity-90 px-8 py-3 text-lg font-semibold"
              onClick={() => scrollToSection("contact")}
            >
              Contact Youth Leaders
            </Button>
            <Button
              variant="outline"
              className="border-methodist-blue text-methodist-blue hover:bg-methodist-blue hover:text-white px-8 py-3 text-lg font-semibold"
            >
              Visit This Sunday
            </Button>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-300">
            <h3 className="text-lg font-semibold mb-4 text-methodist-blue">Questions? Contact Our Youth Leaders:</h3>
            <div className="space-y-2 text-warm-gray">
              <p>Youth Pastor: Rev. Sarah Johnson</p>
              <p>Email: youth@blessedumc.org</p>
              <p>Phone: (555) 123-4567</p>
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