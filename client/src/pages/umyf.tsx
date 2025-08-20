import { useEffect } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Users, Heart, BookOpen, Music } from "lucide-react";

export default function UMYF() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="font-sans bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-methodist-blue via-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6" data-testid="umyf-title">
            UMYF
          </h1>
          <h2 className="text-2xl md:text-3xl font-heading font-medium mb-4">
            United Methodist Youth Fellowship
          </h2>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Where young hearts connect with God and each other in faith, friendship, and service
          </p>
          <Button 
            onClick={() => scrollToSection('activities')}
            className="bg-warm-gold text-methodist-blue hover:bg-opacity-90 px-8 py-3 text-lg font-semibold"
            data-testid="button-learn-more"
          >
            Join Our Fellowship
          </Button>
        </div>
      </section>

      {/* About UMYF Section */}
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
            <Card className="text-center">
              <CardHeader>
                <Heart className="w-12 h-12 text-warm-gold mx-auto mb-4" />
                <CardTitle className="text-xl font-heading text-methodist-blue">
                  Faith & Fellowship
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-warm-gray">
                  Deepening our relationship with God through prayer, Bible study, and meaningful discussions
                  about faith and life.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="w-12 h-12 text-warm-gold mx-auto mb-4" />
                <CardTitle className="text-xl font-heading text-methodist-blue">
                  Community Service
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-warm-gray">
                  Making a difference through local service projects, mission trips, and outreach 
                  programs that help those in need.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Music className="w-12 h-12 text-warm-gold mx-auto mb-4" />
                <CardTitle className="text-xl font-heading text-methodist-blue">
                  Fun & Friendship
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-warm-gray">
                  Building lasting friendships through games, retreats, social events, and shared 
                  experiences that create memories for life.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Meeting Times & Activities */}
      <section id="activities" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Meeting Times */}
            <div>
              <h2 className="text-3xl font-heading font-bold text-methodist-blue mb-8">
                When We Meet
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Calendar className="w-6 h-6 text-warm-gold mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold text-methodist-blue mb-2">
                      Sunday Youth Group
                    </h3>
                    <p className="text-warm-gray mb-1">Every Sunday after worship service</p>
                    <p className="text-warm-gray">10:30 AM - 12:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Clock className="w-6 h-6 text-warm-gold mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold text-methodist-blue mb-2">
                      Wednesday Bible Study
                    </h3>
                    <p className="text-warm-gray mb-1">Mid-week fellowship and study</p>
                    <p className="text-warm-gray">7:00 PM - 8:30 PM</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <BookOpen className="w-6 h-6 text-warm-gold mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold text-methodist-blue mb-2">
                      Monthly Service Projects
                    </h3>
                    <p className="text-warm-gray mb-1">Community outreach and service</p>
                    <p className="text-warm-gray">First Saturday of each month</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Events */}
            <div>
              <h2 className="text-3xl font-heading font-bold text-methodist-blue mb-8">
                Upcoming Events
              </h2>
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Youth Winter Retreat</CardTitle>
                    <CardDescription>February 14-16, 2025</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-warm-gray">
                      Join us for a weekend of faith, fun, and fellowship at Camp Marymount.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Community Food Drive</CardTitle>
                    <CardDescription>March 1-8, 2025</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-warm-gray">
                      Help us collect food donations for local families in need.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Youth Sunday Leadership</CardTitle>
                    <CardDescription>March 15, 2025</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-warm-gray">
                      Our youth will lead worship service, sharing their faith with the congregation.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Join Section */}
      <section className="py-16 bg-methodist-blue text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
            Ready to Join UMYF?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Whether you're new to faith or have been part of our church family for years, 
            all youth ages 12-18 are welcome in our fellowship.
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Button 
              onClick={() => scrollToSection('contact')}
              className="bg-white text-methodist-blue hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
              data-testid="button-contact-youth"
            >
              Contact Youth Leaders
            </Button>
            <Button 
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-methodist-blue px-8 py-3 text-lg font-semibold"
              data-testid="button-visit-sunday"
            >
              Visit This Sunday
            </Button>
          </div>
          
          <div className="mt-12 pt-8 border-t border-blue-400">
            <h3 className="text-lg font-semibold mb-4">Questions? Contact Our Youth Leaders:</h3>
            <div className="space-y-2 text-blue-100">
              <p>Youth Pastor: Rev. Sarah Johnson</p>
              <p>Email: youth@blessedumc.org</p>
              <p>Phone: (555) 123-4567</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}