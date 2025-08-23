import { useEffect, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Baby, Users, BookOpen, Handshake, Music, Home, ArrowUp, Clock, MapPin, Mail, Phone } from "lucide-react";
import { Link } from "wouter";

export default function MinistriesPage() {
  const [showBackButton, setShowBackButton] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleScroll = () => setShowBackButton(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const ministries = [
    {
      title: "Children's Ministry",
      description: "Nurturing young hearts with age-appropriate Bible lessons, crafts, games, and fellowship for children from nursery through 5-11 yrs old",
      icon: Baby,
      color: "bg-warm-gold",
      programs: [
        "Sunday School (9:15 AM)",
        "Vacation Church School",
        "Children's Camp",
      ],
      details: "Our Children's Ministry provides a safe, loving environment where children can grow in their faith through engaging activities, Bible stories, and fellowship with peers. We focus on building strong foundations of Christian values while making learning fun and interactive.",
      contact: "Contact: children@blessedumc.org"
    },
    {
      title: "Youth Ministry",
      description: "Empowering teenagers to develop lasting faith through engaging programs, mission trips, and authentic community.",
      icon: Users,
      color: "bg-methodist-blue",
      programs: [
        "Care Group",
        "Workshops",
        "Youth Praise & Worship",
        "Confirmation Classes",
        "Youth Camps"
      ],
      details: "Our Youth Ministry creates a space where teenagers can explore their faith, build meaningful relationships, and develop leadership skills. We offer dynamic programs that address real-life issues while building a strong foundation in Christian values.",
      contact: "Contact: youth@blessedumc.org"
    },
    {
      title: "Adult Education",
      description: "Deepen your faith through Bible studies, discussion groups, and educational opportunities for spiritual growth.",
      icon: BookOpen,
      color: "bg-soft-green",
      programs: [
        "Sunday School",
        "Bible Study Groups",
        "Luncheon Fellowship",
      ],
      details: "Our Adult Education ministry offers opportunities for continued spiritual growth through in-depth Bible study, theological discussion, and fellowship. We welcome learners at all levels of biblical knowledge and faith journey.",
      contact: "Contact: education@blessedumc.org"
    },
    {
      title: "Community Outreach",
      description: "Serving our community through food pantries, homeless shelter support, and various local mission initiatives.",
      icon: Handshake,
      color: "bg-warm-gold",
      programs: [
        "Emmanuel Mission Evangelism",
        "Brigada Eskwela"
      ],
      details: "Our Community Outreach ministry puts faith into action by serving those in need throughout our local community. We believe in being the hands and feet of Jesus through practical service and support.",
      contact: "Contact: outreach@blessedumc.org"
    },
    {
      title: "Music Ministry",
      description: "Share your musical gifts through our various ensembles and worship teams that enhance our services.",
      icon: Music,
      color: "bg-methodist-blue",
      programs: [
        "Adult Choir",
        "Praise & Worship",
        "Kid's Praise & Worship",
        "MYAF Praise & Worship"
      ],
      details: "Our Music Ministry uses the gift of music to worship God and inspire the congregation. We welcome musicians of all skill levels and offer opportunities to serve through various musical expressions during worship services.",
      contact: "Contact: music@blessedumc.org"
    },
    {
      title: "Small Groups",
      description: "Build deeper relationships and grow in faith through intimate small group settings in homes throughout our community.",
      icon: Home,
      color: "bg-soft-green",
      programs: [
        "BED Fellowship",
        "Care Group",
        "Men's & Women's Groups",
        "Young Adult Ministry"
      ],
      details: "Our Small Groups ministry creates intimate spaces for deeper fellowship, prayer, and spiritual growth. These groups meet in homes and provide opportunity for authentic relationships and mutual support in faith.",
      contact: "Contact: smallgroups@blessedumc.org"
    }
  ];

  return (
    <div className="font-sans bg-gray-50 min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-methodist-blue via-blue-700 to-blue-900 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="font-heading text-lg font-bold tracking-wide text-warm-gold uppercase mb-4">
            Blessed UMC
          </h3>
          <h1 className="text-5xl lg:text-7xl font-heading font-black mb-6 leading-tight tracking-tight">
            Ministries & Programs
          </h1>
          <p className="text-xl lg:text-2xl max-w-4xl mx-auto opacity-90">
            Discover opportunities to grow in faith, serve others, and build meaningful connections within our church family.
          </p>
        </div>
      </section>

      {/* Ministries Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ministries.map((ministry, index) => {
              const IconComponent = ministry.icon;
              return (
                <div key={index} className="bg-gray-50 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 border border-gray-200">
                  <div className={`w-20 h-20 ${ministry.color} rounded-full flex items-center justify-center mb-6 shadow-lg`}>
                    <IconComponent className="text-white w-10 h-10" />
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-methodist-blue mb-4">{ministry.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {ministry.description}
                  </p>
                  
                  <div className="mb-6">
                    <h4 className="font-bold text-gray-900 mb-3">Programs & Activities:</h4>
                    <ul className="text-gray-600 space-y-2">
                      {ministry.programs.map((program, programIndex) => (
                        <li key={programIndex} className="flex items-center">
                          <div className="w-2 h-2 bg-methodist-blue rounded-full mr-3"></div>
                          {program}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-100">
                    <p className="text-gray-700 leading-relaxed mb-4">
                      {ministry.details}
                    </p>
                    <p className="text-sm text-methodist-blue font-medium">
                      {ministry.contact}
                    </p>
                  </div>

                  <Button 
                    className="w-full bg-methodist-blue text-white py-3 rounded-full font-bold hover:bg-methodist-blue/90 transition-all transform hover:scale-105 shadow-lg"
                  >
                    Get Involved
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How to Get Involved Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-heading font-black text-gray-900 mb-6">
              Ready to Get Involved?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join us in making a difference in our community and growing in faith together.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 text-center shadow-xl border border-gray-100">
              <div className="w-16 h-16 bg-methodist-blue rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Visit Us</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Come to one of our Sunday services and experience our welcoming community firsthand.
              </p>
              <Button className="bg-methodist-blue text-white px-6 py-3 rounded-full font-bold hover:bg-methodist-blue/90 transition-all">
                Plan Your Visit
              </Button>
            </div>

            <div className="bg-white rounded-3xl p-8 text-center shadow-xl border border-gray-100">
              <div className="w-16 h-16 bg-warm-gold rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Us</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Reach out to our ministry leaders to learn more about specific programs and how to get involved.
              </p>
              <Link href="/">
                <Button className="bg-warm-gold text-white px-6 py-3 rounded-full font-bold hover:bg-warm-gold/90 transition-all">
                  Send Message
                </Button>
              </Link>
            </div>

            <div className="bg-white rounded-3xl p-8 text-center shadow-xl border border-gray-100">
              <div className="w-16 h-16 bg-soft-green rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Learn More</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Explore our website to learn more about our beliefs, history, and upcoming events.
              </p>
              <Link href="/about">
                <Button className="bg-soft-green text-white px-6 py-3 rounded-full font-bold hover:bg-soft-green/90 transition-all">
                  Our Story
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-methodist-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-black mb-6">Join Our Ministry</h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Whether you're looking to serve, learn, or connect, there's a place for you in our ministries.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-lg mb-2">Visit Us</h3>
              <p className="opacity-90">69 Don Placido Campos Ave., San Jose<br />Dasmariñas, Cavite</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-lg mb-2">Service Times</h3>
              <p className="opacity-90">Sunday: 9:15 AM<br /></p>
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
              <p className="opacity-90">iamblessedchurch@gmail.com</p>
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